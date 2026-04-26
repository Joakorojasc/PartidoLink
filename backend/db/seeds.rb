require 'faker'

puts "Sembrando datos de PartidoLink..."

# -------------------------
# Sports
# -------------------------
sports_data = [
  { name: 'Fútbol',      sport_type: 'team',       icon: '⚽' },
  { name: 'Pádel',       sport_type: 'individual',  icon: '🎾' },
  { name: 'Tenis',       sport_type: 'individual',  icon: '🎾' },
  { name: 'Golf',        sport_type: 'individual',  icon: '⛳' },
  { name: 'Básquetbol',  sport_type: 'team',        icon: '🏀' },
  { name: 'Volleyball',  sport_type: 'team',        icon: '🏐' }
]

sports = sports_data.map do |s|
  Sport.find_or_create_by!(name: s[:name]) { |sp| sp.sport_type = s[:sport_type]; sp.icon = s[:icon] }
end
puts "  #{sports.count} deportes creados"

# -------------------------
# Venues
# -------------------------
communes = ['Providencia', 'Las Condes', 'Ñuñoa', 'Santiago Centro',
            'Vitacura', 'La Florida', 'Macul', 'San Miguel', 'Peñalolén', 'Lo Barnechea']

venues_data = [
  { name: 'Complejo Deportivo Providencia', commune: 'Providencia',    sport: sports[0], price: 15000 },
  { name: 'Padel Express Las Condes',       commune: 'Las Condes',     sport: sports[1], price: 22000 },
  { name: 'Club de Tenis Nunoa',            commune: 'Ñuñoa',          sport: sports[2], price: 18000 },
  { name: 'Club de Golf Lo Barnechea',      commune: 'Lo Barnechea',   sport: sports[3], price: 35000 },
  { name: 'Gimnasio Municipal Macul',       commune: 'Macul',          sport: sports[4], price: 8000  },
  { name: 'Cancha Volleyball Vitacura',     commune: 'Vitacura',       sport: sports[5], price: 12000 },
  { name: 'Estadio San Miguel',             commune: 'San Miguel',     sport: sports[0], price: 10000 },
  { name: 'Centro Padel Penalolen',         commune: 'Peñalolén',      sport: sports[1], price: 20000 },
  { name: 'Cancha Futbol La Florida',       commune: 'La Florida',     sport: sports[0], price: 11000 },
  { name: 'Multicancha Santiago Centro',    commune: 'Santiago Centro', sport: sports[4], price: 9000  }
]

venues = venues_data.map do |v|
  Venue.find_or_create_by!(name: v[:name]) do |venue|
    venue.commune = v[:commune]
    venue.city = 'Santiago'
    venue.sport = v[:sport]
    venue.price_per_hour = v[:price]
    venue.address = "Av. #{Faker::Address.street_name} #{rand(100..9999)}, #{v[:commune]}"
    venue.description = "Instalaciones de primer nivel para #{v[:sport].name}. Estacionamiento y camarines disponibles."
    venue.phone = "+56 2 2#{rand(1000000..9999999)}"
    venue.is_active = true
  end
end
puts "  #{venues.count} canchas creadas"

# -------------------------
# Helpers
# -------------------------
first_names = %w[Sebastian Matias Felipe Nicolas Ignacio Rodrigo Cristobal Diego Andres Pablo
                 Valentina Catalina Constanza Camila Isidora Sofia Javiera Daniela Fernanda Francisca]
last_names = %w[Gonzalez Munoz Rojas Diaz Perez Soto Contreras Silva Martinez Sepulveda
                Morales Torres Flores Castro Rivera Lopez Vega Ramirez Fuentes Herrera]

rut_counter = 10_000_000

def generate_rut(num)
  digits = num.to_s.chars.map(&:to_i)
  factors = [2, 3, 4, 5, 6, 7]
  sum = digits.reverse.each_with_index.sum { |d, i| d * factors[i % 6] }
  mod = 11 - (sum % 11)
  dv = mod == 11 ? '0' : mod == 10 ? 'K' : mod.to_s
  formatted = num.to_s.reverse.scan(/.{1,3}/).join('.').reverse
  "#{formatted}-#{dv}"
end

# -------------------------
# Users (25)
# -------------------------
users = []
25.times do |i|
  fn = first_names[i % first_names.count]
  ln = last_names.sample
  email = "#{fn.downcase}#{i + 1}@partidolink.cl"
  rut_num = rut_counter + i * 97 + 1
  user = User.find_or_create_by!(email: email) do |u|
    u.name = "#{fn} #{ln}"
    u.rut = generate_rut(rut_num)
    u.phone = "+56 9 #{rand(10_000_000..99_999_999)}"
    u.bio = "Apasionado del deporte. Nivel #{%w[principiante intermedio avanzado].sample}."
    u.password = 'Password123!'
    u.jti = SecureRandom.uuid
  end
  users << user

  # Assign 1-3 random sports
  sports.sample(rand(1..3)).each do |sport|
    UserSport.find_or_create_by!(user: user, sport: sport) do |us|
      us.skill_level = %w[beginner intermediate advanced pro].sample
    end
  end
end
puts "  #{users.count} usuarios creados"

# -------------------------
# Teams (10)
# -------------------------
team_names_data = [
  { name: 'Los Condores FC',       sport_idx: 0 },
  { name: 'Pumas de Providencia',  sport_idx: 0 },
  { name: 'Huaso United',          sport_idx: 0 },
  { name: 'Rancagua Stars',        sport_idx: 4 },
  { name: 'Tralca Padel Club',     sport_idx: 1 },
  { name: 'Los Penones',           sport_idx: 0 },
  { name: 'Viento del Sur',        sport_idx: 5 },
  { name: 'Cordillera FC',         sport_idx: 0 },
  { name: 'Los Tenistas MN',       sport_idx: 2 },
  { name: 'Araucanos SC',          sport_idx: 4 }
]

teams = team_names_data.each_with_index.map do |td, i|
  sport = sports[td[:sport_idx]]
  captain = users[i * 2]
  commune = communes.sample

  team = Team.find_or_create_by!(name: td[:name], sport: sport) do |t|
    t.captain = captain
    t.description = "Equipo de #{sport.name} en #{commune}. Bienvenidos jugadores comprometidos."
    t.is_open = [true, true, false].sample
    t.commune = commune
  end

  TeamMember.find_or_create_by!(team: team, user: captain) { |tm| tm.role = 'captain' }

  additional = (users - [captain]).sample(rand(3..7))
  additional.each do |member|
    TeamMember.find_or_create_by!(team: team, user: member) { |tm| tm.role = 'member' }
  end

  team
end
puts "  #{teams.count} equipos creados"

# -------------------------
# Bookings
# -------------------------
bookings = []
10.times do |i|
  team = teams[i % teams.count]
  venue = venues.select { |v| v.sport_id == team.sport_id }.first || venues.first
  date = Date.today + rand(-30..30)
  booking = Booking.find_or_create_by!(venue: venue, team: team, date: date) do |b|
    b.created_by = team.captain
    b.start_time = Time.parse("#{10 + (i % 8)}:00")
    b.end_time   = Time.parse("#{11 + (i % 8)}:00")
    b.status = 'confirmed'
    b.payment_mode = %w[full split].sample
  end
  bookings << booking
end
puts "  #{bookings.count} reservas creadas"

# -------------------------
# Matches (20)
# -------------------------
created_matches = []

20.times do |i|
  home = teams.sample
  away = (teams - [home]).sample
  sport = home.sport
  venue = venues.select { |v| v.sport_id == sport.id }.first || venues.first
  booking = bookings.select { |b| b.team_id == home.id }.first
  scheduled_at = Time.now + rand(-45..30).days

  match = Match.create!(
    home_team: home,
    away_team: away,
    sport: sport,
    venue: venue,
    booking: booking,
    scheduled_at: scheduled_at,
    status: 'scheduled',
    is_open: [true, true, false].sample,
    commune: home.commune
  )
  created_matches << match
end

# Validated results (first 8 matches)
created_matches.first(8).each do |match|
  home_score = rand(0..4)
  away_score = rand(0..4)
  [match.home_team, match.away_team].each do |team|
    MatchResult.find_or_create_by!(match: match, submitted_by_team: team) do |r|
      r.home_score = home_score
      r.away_score = away_score
    end
  end
  match.reload
end

# Disputed results (matches 9-12)
created_matches[8..11].each do |match|
  unless MatchResult.exists?(match: match, submitted_by_team: match.home_team)
    MatchResult.create!(match: match, submitted_by_team: match.home_team, home_score: rand(0..2), away_score: rand(3..5))
  end
  unless MatchResult.exists?(match: match, submitted_by_team: match.away_team)
    MatchResult.create!(match: match, submitted_by_team: match.away_team, home_score: rand(3..5), away_score: rand(0..2))
  end
  match.update_columns(status: 'disputed')
end

puts "  #{created_matches.count} partidos creados"

# -------------------------
# Conversations & Messages
# -------------------------
chat_lines = [
  "Hola, queremos desafiarlos la próxima semana.",
  "Perfecto! Que dia les acomoda?",
  "El sábado por la tarde, les sirve?",
  "Podemos el sábado a las 16:00 en Providencia.",
  "De acuerdo. Confirman la cancha?",
  "Sí, ya reservamos en el Complejo Deportivo.",
  "Excelente, nos vemos ahí. Suerte a todos!",
  "Recuerden traer petos de repuesto.",
  "Cuántos vendrán por su parte?",
  "Vendremos con el equipo completo.",
  "Nosotros también. Será un gran partido.",
  "Arbitraje neutral o cada equipo pone uno?",
  "Mejor neutral, pedimos uno al club.",
  "Perfecto. A darlo todo!",
  "Los esperamos. Va a ser un gran partido.",
  "Confirmamos el resultado después aquí?",
  "Sí, registramos en la app y listo.",
  "Muy buena la plataforma!",
  "Hasta el sábado equipo!"
]

15.times do |i|
  match = created_matches.sample
  team_a = match.home_team
  team_b = match.away_team

  conversation = Conversation.create!(
    match: match,
    title: "#{team_a.name} vs #{team_b.name}",
    conversation_type: 'match'
  )
  ConversationParticipant.create!(conversation: conversation, team: team_a)
  ConversationParticipant.create!(conversation: conversation, team: team_b)

  all_members = (team_a.members + team_b.members).uniq
  rand(5..15).times do
    sender = all_members.sample || users.sample
    Message.create!(
      conversation: conversation,
      sender: sender,
      content: chat_lines.sample,
      created_at: rand(1..30).days.ago
    )
  end
end
puts "  15 conversaciones con mensajes creadas"

# -------------------------
# Ratings
# -------------------------
created_matches.first(8).each do |match|
  rater = match.home_team.members.first || users.first
  next if Rating.exists?(rater: rater, rated_team: match.away_team, match: match)
  Rating.create!(
    rater: rater,
    rated_team: match.away_team,
    match: match,
    score: rand(3..5),
    comment: ["Muy buen equipo, juego limpio.", "Gran partido, muy competitivos.", "Bien organizados y respetuosos.", "Gran nivel, volveríamos a jugar con ellos."].sample,
    is_public: true
  )
end
puts "  Valoraciones creadas"

puts ""
puts "PartidoLink sembrado exitosamente!"
puts "  Usuarios: #{User.count} | Equipos: #{Team.count} | Partidos: #{Match.count} | Canchas: #{Venue.count}"
