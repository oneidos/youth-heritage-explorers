-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT 'Studente',
  active_role TEXT NOT NULL DEFAULT 'visitatore' CHECK (active_role IN ('visitatore','cicerone')),
  age INT,
  gender TEXT,
  school TEXT,
  city TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  favorite_places TEXT,
  availability TEXT,
  accessible_tours BOOLEAN NOT NULL DEFAULT false,
  fsl_enabled BOOLEAN NOT NULL DEFAULT false,
  fsl_interested BOOLEAN NOT NULL DEFAULT false,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  visitor_onboarded BOOLEAN NOT NULL DEFAULT false,
  guide_onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ITINERARIES
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 90,
  meeting_point TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itineraries TO authenticated;
GRANT ALL ON public.itineraries TO service_role;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "itineraries readable by authenticated" ON public.itineraries FOR SELECT TO authenticated USING (true);
CREATE POLICY "guide manages own itineraries" ON public.itineraries FOR ALL TO authenticated USING (guide_id = auth.uid()) WITH CHECK (guide_id = auth.uid());

CREATE TABLE public.itinerary_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itinerary_stops TO authenticated;
GRANT ALL ON public.itinerary_stops TO service_role;
ALTER TABLE public.itinerary_stops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stops readable by authenticated" ON public.itinerary_stops FOR SELECT TO authenticated USING (true);
CREATE POLICY "guide manages own stops" ON public.itinerary_stops FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.itineraries i WHERE i.id = itinerary_id AND i.guide_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.itineraries i WHERE i.id = itinerary_id AND i.guide_id = auth.uid()));

-- BOOKINGS
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'in_attesa' CHECK (status IN ('in_attesa','accettata','rifiutata','completata')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "booking parties can read" ON public.bookings FOR SELECT TO authenticated USING (visitor_id = auth.uid() OR guide_id = auth.uid());
CREATE POLICY "visitor creates booking" ON public.bookings FOR INSERT TO authenticated WITH CHECK (visitor_id = auth.uid());
CREATE POLICY "booking parties can update" ON public.bookings FOR UPDATE TO authenticated USING (visitor_id = auth.uid() OR guide_id = auth.uid()) WITH CHECK (visitor_id = auth.uid() OR guide_id = auth.uid());
CREATE POLICY "visitor deletes booking" ON public.bookings FOR DELETE TO authenticated USING (visitor_id = auth.uid());

-- REVIEWS
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  author_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews readable by authenticated" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "visitor manages own reviews" ON public.reviews FOR ALL TO authenticated USING (visitor_id = auth.uid()) WITH CHECK (visitor_id = auth.uid());

-- STAMPS
CREATE TABLE public.stamps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  city TEXT NOT NULL,
  itinerary_title TEXT,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stamps TO authenticated;
GRANT ALL ON public.stamps TO service_role;
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visitor manages own stamps" ON public.stamps FOR ALL TO authenticated USING (visitor_id = auth.uid()) WITH CHECK (visitor_id = auth.uid());

-- VISIT PHOTOS
CREATE TABLE public.visit_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visit_photos TO authenticated;
GRANT ALL ON public.visit_photos TO service_role;
ALTER TABLE public.visit_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visitor manages own photos" ON public.visit_photos FOR ALL TO authenticated USING (visitor_id = auth.uid()) WITH CHECK (visitor_id = auth.uid());

-- FSL HOURS
CREATE TABLE public.fsl_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  hours NUMERIC NOT NULL DEFAULT 2,
  activity_date DATE NOT NULL DEFAULT current_date,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fsl_hours TO authenticated;
GRANT ALL ON public.fsl_hours TO service_role;
ALTER TABLE public.fsl_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guide manages own fsl hours" ON public.fsl_hours FOR ALL TO authenticated USING (guide_id = auth.uid()) WITH CHECK (guide_id = auth.uid());

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- storage policies for visit photos (bucket created separately)
CREATE POLICY "visit photos own read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'visit-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "visit photos own insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'visit-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "visit photos own delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'visit-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- DEMO GUIDES
INSERT INTO public.profiles (id, display_name, active_role, age, gender, school, city, interests, languages, bio, favorite_places, availability, accessible_tours, is_demo, guide_onboarded) VALUES
('11111111-1111-4111-8111-111111111111','Giulia M.','cicerone',17,'femmina','Liceo Classico Marco Polo','Venezia','{"arte","storia","fotografia"}','{"italiano","inglese"}','Vivo a Cannaregio da sempre. Ti porto nella Venezia che i turisti non vedono: calli silenziose, botteghe di remèri e squeri.','Cannaregio, Fondamenta della Misericordia','Pomeriggio nei giorni feriali, weekend',true,true,true),
('22222222-2222-4222-8222-222222222222','Matteo R.','cicerone',18,'maschio','ITIS Zuccante','Venezia','{"musica","street food","architettura"}','{"italiano","inglese","spagnolo"}','Suono in una band e conosco ogni bacaro decente della città. Tour tra cicchetti, murales e cortili nascosti.','Giudecca, Dorsoduro','Sabato e domenica mattina',false,true,true),
('33333333-3333-4333-8333-333333333333','Sofia B.','cicerone',17,'femmina','Liceo Artistico Ripetta','Roma','{"arte","archeologia","cinema"}','{"italiano","inglese","francese"}','Studio arte e disegno dal vero tra i Fori. Ti mostro la Roma stratificata, dai vicoli di Monti alle terrazze gratuite.','Monti, Testaccio','Tutti i pomeriggi',true,true,true),
('44444444-4444-4444-8444-444444444444','Leonardo F.','cicerone',19,'maschio','Liceo Scientifico Righi','Roma','{"sport","storia","street food"}','{"italiano","inglese"}','Corro lungo il Tevere ogni mattina. Tour a passo svelto tra rioni, mercati e la migliore pizza al taglio.','Trastevere, Garbatella','Mattina presto, weekend',false,true,true),
('55555555-5555-4555-8555-555555555555','Chiara V.','cicerone',16,'femmina','Liceo Michelangiolo','Firenze','{"arte","moda","fotografia"}','{"italiano","inglese"}','Firenze non è solo il Duomo: ti porto negli atelier dell''Oltrarno e sui tetti da cui guardiamo il tramonto.','Oltrarno, San Niccolò','Weekend e mercoledì pomeriggio',true,true,true),
('66666666-6666-4666-8666-666666666666','Antonio D.','cicerone',18,'maschio','Liceo Umberto I','Napoli','{"street food","musica","storia"}','{"italiano","inglese"}','Napoli si ascolta prima di guardarla. Vicoli dei Quartieri, cortili, sfogliatella calda e un po'' di leggende.','Quartieri Spagnoli, Sanità','Ogni giorno dopo le 15',false,true,true),
('77777777-7777-4777-8777-777777777777','Beatrice L.','cicerone',17,'femmina','Liceo Gioberti','Torino','{"cinema","architettura","caffè"}','{"italiano","inglese","francese"}','Torino è una città di portici e segreti. Tra caffè storici, Mole e murales di Barriera.','Quadrilatero, San Salvario','Pomeriggi feriali',true,true,true),
('88888888-8888-4888-8888-888888888888','Salvatore P.','cicerone',18,'maschio','Liceo Vittorio Emanuele II','Palermo','{"street food","storia","mare"}','{"italiano","inglese"}','Mercati che urlano, chiese arabo-normanne e panelle. Palermo vera, senza filtri.','Ballarò, Kalsa','Weekend',false,true,true);

-- DEMO ITINERARIES
INSERT INTO public.itineraries (id, guide_id, city, title, description, duration_minutes, meeting_point) VALUES
('a1111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','Venezia','Venezia di chi ci abita','Calli silenziose, botteghe artigiane e scorci senza folla.',120,'Stazione Santa Lucia, sotto l''orologio'),
('a2222222-2222-4222-8222-222222222222','22222222-2222-4222-8222-222222222222','Venezia','Cicchetti e murales','Giro tra bacari, cortili e street art della Giudecca.',90,'Fermata vaporetto Zattere'),
('a3333333-3333-4333-8333-333333333333','33333333-3333-4333-8333-333333333333','Roma','Roma stratificata','Dai Fori a Monti, passando per terrazze panoramiche gratuite.',150,'Colosseo, uscita metro'),
('a4444444-4444-4444-8444-444444444444','44444444-4444-4444-8444-444444444444','Roma','Roma a passo svelto','Trastevere e Garbatella tra mercati e pizza al taglio.',120,'Piazza Trilussa, Trastevere'),
('a5555555-5555-4555-8555-555555555555','55555555-5555-4555-8555-555555555555','Firenze','Oltrarno artigiano','Atelier, botteghe di restauro e tramonto dai tetti.',120,'Ponte Vecchio, lato Oltrarno'),
('a6666666-6666-4666-8666-666666666666','66666666-6666-4666-8666-666666666666','Napoli','Napoli si ascolta','Quartieri Spagnoli, Sanità, leggende e sfogliatelle.',135,'Piazza del Gesù Nuovo'),
('a7777777-7777-4777-8777-777777777777','77777777-7777-4777-8777-777777777777','Torino','Portici e segreti','Caffè storici, Quadrilatero e murales di Barriera.',120,'Piazza Castello, davanti a Palazzo Madama'),
('a8888888-8888-4888-8888-888888888888','88888888-8888-4888-8888-888888888888','Palermo','Mercati e arabo-normanno','Ballarò, Kalsa, panelle e chiese nascoste.',120,'Quattro Canti');

INSERT INTO public.itinerary_stops (itinerary_id, position, title, description) VALUES
('a1111111-1111-4111-8111-111111111111',1,'Fondamenta della Misericordia','Il canale dove ci si trova la sera.'),
('a1111111-1111-4111-8111-111111111111',2,'Squero di San Trovaso','Dove si costruiscono ancora le gondole.'),
('a1111111-1111-4111-8111-111111111111',3,'Libreria Acqua Alta','Libri nelle gondole, davvero.'),
('a2222222-2222-4222-8222-222222222222',1,'Bacaro in Dorsoduro','Primo cicchetto e spritz analcolico.'),
('a2222222-2222-4222-8222-222222222222',2,'Murales della Giudecca','Street art vista laguna.'),
('a3333333-3333-4333-8333-333333333333',1,'Fori Imperiali','Disegno dal vero, cinque minuti.'),
('a3333333-3333-4333-8333-333333333333',2,'Rione Monti','Botteghe e vinili.'),
('a3333333-3333-4333-8333-333333333333',3,'Terrazza del Vittoriano','Vista gratuita se sai dove entrare.'),
('a4444444-4444-4444-8444-444444444444',1,'Mercato di San Cosimato','Frutta e chiacchiere.'),
('a4444444-4444-4444-8444-444444444444',2,'Garbatella','Lotti popolari anni ''20.'),
('a5555555-5555-4555-8555-555555555555',1,'Santo Spirito','La piazza dei fiorentini.'),
('a5555555-5555-4555-8555-555555555555',2,'Bottega di restauro','Doratura a foglia.'),
('a5555555-5555-4555-8555-555555555555',3,'Piazzale Michelangelo','Tramonto.'),
('a6666666-6666-4666-8666-666666666666',1,'Quartieri Spagnoli','Vicoli e panni stesi.'),
('a6666666-6666-4666-8666-666666666666',2,'Cimitero delle Fontanelle','Storia e leggenda.'),
('a7777777-7777-4777-8777-777777777777',1,'Caffè storico','Bicerin obbligatorio.'),
('a7777777-7777-4777-8777-777777777777',2,'Quadrilatero Romano','Cortili nascosti.'),
('a8888888-8888-4888-8888-888888888888',1,'Mercato di Ballarò','Le voci dei venditori.'),
('a8888888-8888-4888-8888-888888888888',2,'Kalsa','Chiese e rovine.');

INSERT INTO public.reviews (guide_id, visitor_id, rating, comment, author_name) VALUES
('11111111-1111-4111-8111-111111111111','33333333-3333-4333-8333-333333333333',5,'Giulia mi ha fatto vedere una Venezia che non immaginavo. Zero turisti.','Marta, 17'),
('11111111-1111-4111-8111-111111111111','44444444-4444-4444-8444-444444444444',4,'Bravissima, tante storie di famiglia legate ai posti.','Luca, 16'),
('22222222-2222-4222-8222-222222222222','55555555-5555-4555-8555-555555555555',5,'Giro perfetto, i cicchetti erano il top.','Elena, 18'),
('33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111',5,'Sofia disegna mentre spiega, esperienza unica.','Davide, 17'),
('44444444-4444-4444-8444-444444444444','22222222-2222-4222-8222-222222222222',4,'Ritmo veloce ma tantissime cose viste.','Giorgia, 16'),
('55555555-5555-4555-8555-555555555555','66666666-6666-4666-8666-666666666666',5,'L''Oltrarno con lei è un''altra Firenze.','Nicolò, 17'),
('66666666-6666-4666-8666-666666666666','77777777-7777-4777-8777-777777777777',5,'Antonio racconta Napoli come un film.','Sara, 18'),
('77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888',4,'Molto preparata sui caffè storici.','Filippo, 17'),
('88888888-8888-4888-8888-888888888888','11111111-1111-4111-8111-111111111111',5,'Ballarò con lui è un''esperienza sensoriale.','Alice, 16');