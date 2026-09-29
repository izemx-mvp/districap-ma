-- ROLES ---------------------------------------------------------------
create type public.app_role as enum ('admin','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- CATALOGUE -----------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  parent_slug text,
  image_key text,
  intro text,
  position int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
grant insert, update, delete on public.categories to authenticated;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select to anon, authenticated using (true);
create policy "categories admin write" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);
grant select on public.brands to anon, authenticated;
grant all on public.brands to service_role;
grant insert, update, delete on public.brands to authenticated;
alter table public.brands enable row level security;
create policy "brands public read" on public.brands for select to anon, authenticated using (true);
create policy "brands admin write" on public.brands for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sku text not null,
  brand_slug text,
  category_slug text not null,
  price numeric(10,2),
  old_price numeric(10,2),
  in_stock boolean not null default true,
  is_new boolean not null default false,
  short_description text,
  description text,
  specs jsonb not null default '{}'::jsonb,
  image_key text,
  created_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
grant insert, update, delete on public.products to authenticated;
alter table public.products enable row level security;
create policy "products public read" on public.products for select to anon, authenticated using (true);
create policy "products admin write" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- COMMANDES -----------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  full_name text not null,
  company text,
  phone text not null,
  email text not null,
  city text not null,
  address text not null,
  notes text,
  payment_method text not null default 'Paiement à la livraison',
  total numeric(10,2) not null default 0,
  status text not null default 'Nouvelle',
  created_at timestamptz not null default now()
);
grant insert on public.orders to anon, authenticated;
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders public insert" on public.orders for insert to anon, authenticated with check (true);
create policy "orders admin read" on public.orders for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "orders admin update" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  sku text,
  unit_price numeric(10,2),
  quantity int not null default 1,
  created_at timestamptz not null default now()
);
grant insert on public.order_items to anon, authenticated;
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "order items public insert" on public.order_items for insert to anon, authenticated with check (true);
create policy "order items admin read" on public.order_items for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  phone text not null,
  city text,
  project_type text not null,
  budget text,
  description text not null,
  status text not null default 'Nouvelle',
  created_at timestamptz not null default now()
);
grant insert on public.quote_requests to anon, authenticated;
grant select, update on public.quote_requests to authenticated;
grant all on public.quote_requests to service_role;
alter table public.quote_requests enable row level security;
create policy "quotes public insert" on public.quote_requests for insert to anon, authenticated with check (true);
create policy "quotes admin read" on public.quote_requests for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "quotes admin update" on public.quote_requests for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "contact public insert" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "contact admin read" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select on public.newsletter_subscribers to authenticated;
grant all on public.newsletter_subscribers to service_role;
alter table public.newsletter_subscribers enable row level security;
create policy "newsletter public insert" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
create policy "newsletter admin read" on public.newsletter_subscribers for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- SEED ----------------------------------------------------------------
insert into public.categories (slug, name, parent_slug, image_key, intro, position) values
('videosurveillance','Vidéosurveillance',null,'camera','Caméras IP, kits complets et enregistreurs pour sécuriser vos locaux professionnels et résidentiels partout au Maroc.',1),
('cameras-ip','Caméras IP','videosurveillance','camera',null,1),
('cameras-wifi','Caméras WiFi','videosurveillance','camera',null,2),
('kits-complets','Kits complets','videosurveillance','camera',null,3),
('enregistreurs','Enregistreurs NVR/DVR','videosurveillance','camera',null,4),
('accessoires-video','Accessoires','videosurveillance','camera',null,5),
('alarme-intrusion','Alarme & Intrusion',null,'alarme','Centrales, détecteurs et sirènes pour une protection anti-intrusion fiable et certifiée.',2),
('centrales-alarme','Centrales','alarme-intrusion','alarme',null,1),
('detecteurs-intrusion','Détecteurs','alarme-intrusion','alarme',null,2),
('sirenes','Sirènes','alarme-intrusion','alarme',null,3),
('claviers','Claviers','alarme-intrusion','alarme',null,4),
('detection-incendie','Détection incendie',null,'incendie','Centrales CMSI, détecteurs et câbles conformes aux normes de sécurité incendie.',3),
('centrales-cmsi','Centrales CMSI','detection-incendie','incendie',null,1),
('detecteurs-incendie','Détecteurs','detection-incendie','incendie',null,2),
('cables-incendie','Câbles','detection-incendie','incendie',null,3),
('accessoires-incendie','Accessoires','detection-incendie','incendie',null,4),
('controle-acces','Contrôle d''accès',null,'acces','Lecteurs, contrôleurs, badges et serrures pour maîtriser les accès de vos sites.',4),
('lecteurs','Lecteurs','controle-acces','acces',null,1),
('controleurs','Contrôleurs','controle-acces','acces',null,2),
('badges','Badges','controle-acces','acces',null,3),
('serrures','Serrures','controle-acces','acces',null,4),
('sonorisation','Sonorisation',null,'sono','Haut-parleurs, projecteurs de son, amplificateurs et tables de mixage pour tous vos espaces.',5),
('haut-parleurs','Haut-parleurs','sonorisation','sono',null,1),
('projecteurs-de-son','Projecteurs de son','sonorisation','sono',null,2),
('amplificateurs','Amplificateurs','sonorisation','sono',null,3),
('tables-de-mixage','Tables de mixage','sonorisation','sono',null,4),
('racks','Racks','sonorisation','sono',null,5),
('videoprojection-affichage','Vidéoprojection & Affichage',null,'av','Vidéoprojecteurs laser, écrans interactifs et solutions de présentation sans fil.',6),
('videoprojecteurs','Vidéoprojecteurs','videoprojection-affichage','av',null,1),
('ecrans-interactifs','Écrans interactifs','videoprojection-affichage','av',null,2),
('presentation-sans-fil','Présentation sans fil','videoprojection-affichage','av',null,3),
('audio-visioconference','Audioconférence & Visioconférence',null,'av','Systèmes de discussion, caméras PTZ et barres de conférence pour vos salles de réunion.',7),
('systemes-discussion','Systèmes de discussion','audio-visioconference','av',null,1),
('cameras-conference','Caméras','audio-visioconference','av',null,2),
('barres-conference','Barres de conférence','audio-visioconference','av',null,3),
('informatique-reseau','Informatique & Réseau',null,'reseau','KVM, précâblage cuivre et fibre, coffrets et baies pour vos infrastructures réseau.',8),
('kvm','KVM','informatique-reseau','reseau',null,1),
('precablage','Précâblage cuivre/fibre','informatique-reseau','reseau',null,2),
('coffrets-baies','Coffrets et baies','informatique-reseau','reseau',null,3);

insert into public.brands (slug, name) values
('hikvision','HIKVISION'),('optoma','Optoma'),('bosch','BOSCH'),('uniview','UNIVIEW'),
('satel','SATEL'),('finsecur','FINSECUR'),('aten','ATEN'),('lumens','LUMENS'),('absen','ABSEN');

insert into public.products (slug,name,sku,brand_slug,category_slug,price,old_price,in_stock,is_new,short_description,description,specs,image_key) values
('camera-ip-dome-4mp-hikvision','Caméra IP dôme 4 MP HIKVISION','DS-2CD1143G2','hikvision','cameras-ip',890.00,1050.00,true,false,'Caméra dôme IP 4 MP avec vision nocturne 30 m et PoE.','Caméra dôme IP 4 MP idéale pour la surveillance intérieure et extérieure. Capteur haute sensibilité, compression H.265+ et alimentation PoE pour une installation simplifiée.','{"Résolution":"4 MP (2560x1440)","Objectif":"2,8 mm","Vision nocturne":"30 m IR","Indice de protection":"IP67","Alimentation":"PoE 802.3af"}','camera'),
('camera-ip-bullet-8mp-uniview','Caméra IP bullet 8 MP UNIVIEW','IPC2128SR3','uniview','cameras-ip',1650.00,null,true,true,'Caméra bullet 4K avec analyse intelligente et IR 50 m.','Caméra bullet 8 MP 4K pour la surveillance périmétrique. Détection de franchissement de ligne et d''intrusion intégrée.','{"Résolution":"8 MP (4K)","Objectif":"2,8-12 mm motorisé","Vision nocturne":"50 m IR","Indice de protection":"IP67","Analyse":"Franchissement de ligne, intrusion"}','camera'),
('camera-ip-ptz-2mp-hikvision','Caméra IP PTZ 2 MP zoom x25 HIKVISION','DS-2DE4425IW','hikvision','cameras-ip',6900.00,null,true,false,'Dôme PTZ motorisé, zoom optique x25 et suivi automatique.','Caméra PTZ extérieure motorisée avec zoom optique x25, suivi automatique des intrus et 300 préréglages.','{"Résolution":"2 MP","Zoom":"optique x25","Vision nocturne":"100 m IR","Préréglages":"300","Indice de protection":"IP66"}','camera'),
('camera-wifi-interieure-3mp','Caméra WiFi intérieure 3 MP','DS-2CV2H31FD','hikvision','cameras-wifi',420.00,520.00,true,false,'Caméra WiFi pivotante avec audio bidirectionnel et micro-SD.','Caméra WiFi intérieure motorisée, suivi de mouvement, audio bidirectionnel et enregistrement sur carte micro-SD jusqu''à 256 Go.','{"Résolution":"3 MP","Connectivité":"WiFi 2,4 GHz","Audio":"bidirectionnel","Stockage":"micro-SD 256 Go max"}','camera'),
('camera-wifi-solaire-4g','Caméra WiFi solaire 4G 4 MP','UNV-SOL4G','uniview','cameras-wifi',2450.00,null,true,true,'Caméra autonome sur panneau solaire avec carte SIM 4G.','Solution de surveillance autonome pour sites isolés : panneau solaire, batterie longue durée et connexion 4G.','{"Résolution":"4 MP","Alimentation":"panneau solaire + batterie","Connectivité":"4G LTE / WiFi","Indice de protection":"IP66"}','camera'),
('kit-8-cameras-wifi-nvr','Kit 8 caméras WiFi 3 MP + NVR 1 To','KIT-WIFI8-3MP','hikvision','kits-complets',7900.00,8900.00,true,false,'Kit complet 8 caméras WiFi, NVR 8 canaux et disque 1 To.','Kit de vidéosurveillance sans fil prêt à installer : 8 caméras WiFi 3 MP, enregistreur NVR 8 canaux avec disque dur 1 To préinstallé et application mobile.','{"Caméras":"8 x 3 MP WiFi","Enregistreur":"NVR 8 canaux","Disque dur":"1 To inclus","Application":"iOS / Android","Vision nocturne":"30 m"}','camera'),
('kit-4-cameras-ip-poe','Kit 4 caméras IP PoE 4 MP + NVR','KIT-POE4-4MP','uniview','kits-complets',5200.00,null,true,false,'Kit filaire PoE 4 caméras 4 MP avec NVR 4 canaux.','Kit vidéosurveillance filaire PoE, installation par un seul câble réseau par caméra. NVR 4 canaux avec disque 1 To.','{"Caméras":"4 x 4 MP PoE","Enregistreur":"NVR 4 canaux PoE","Disque dur":"1 To","Câblage":"RJ45 PoE"}','camera'),
('nvr-16-canaux-4k','Enregistreur NVR 16 canaux 4K','DS-7616NI-K2','hikvision','enregistreurs',3200.00,null,true,false,'NVR 16 canaux 4K, 2 baies disque, sortie HDMI 4K.','Enregistreur réseau 16 canaux compatible 4K, décodage H.265+, 2 emplacements disques jusqu''à 10 To chacun.','{"Canaux":"16","Résolution max":"8 MP / 4K","Disques":"2 x 10 To max","Sorties":"HDMI 4K + VGA"}','camera'),
('dvr-8-canaux-5mp','Enregistreur DVR hybride 8 canaux 5 MP','DS-7208HQHI','hikvision','enregistreurs',1450.00,1690.00,true,false,'DVR hybride 8 canaux compatible caméras analogiques et IP.','Enregistreur hybride 8 canaux acceptant les caméras HD analogiques et IP, idéal pour la mise à niveau d''installations existantes.','{"Canaux":"8 analogiques + 2 IP","Résolution max":"5 MP","Disques":"1 x 10 To max","Sorties":"HDMI + VGA"}','camera'),
('switch-poe-8-ports','Switch PoE 8 ports 120 W','DS-3E0109P','hikvision','accessoires-video',690.00,null,true,false,'Switch PoE 8 ports pour alimenter vos caméras IP.','Switch non administrable 8 ports PoE + 1 port uplink, budget PoE 120 W, protection contre les surtensions.','{"Ports":"8 PoE + 1 uplink","Budget PoE":"120 W","Norme":"802.3af/at","Montage":"bureau ou rack"}','reseau'),
('centrale-alarme-integra-satel','Centrale d''alarme INTEGRA 64 SATEL','INTEGRA-64','satel','centrales-alarme',4300.00,null,true,false,'Centrale filaire et sans fil jusqu''à 64 zones, 8 partitions.','Centrale d''alarme professionnelle INTEGRA 64 : gestion de 64 zones, 8 partitions, notifications push et pilotage via application.','{"Zones":"64","Partitions":"8","Communication":"GSM / Ethernet en option","Application":"INTEGRA CONTROL"}','alarme'),
('detecteur-mouvement-pir','Détecteur de mouvement PIR anti-animaux','SATEL-PIR-25','satel','detecteurs-intrusion',290.00,null,true,false,'Détecteur infrarouge 12 m, immunité animaux jusqu''à 20 kg.','Détecteur de mouvement PIR à double optique, immunité aux animaux domestiques jusqu''à 20 kg et autoprotection à l''ouverture.','{"Portée":"12 m / 90°","Immunité animaux":"20 kg","Autoprotection":"oui","Alimentation":"12 V DC"}','alarme'),
('sirene-exterieure-autoalimentee','Sirène extérieure auto-alimentée avec flash','SPL-5010','satel','sirenes',540.00,620.00,true,false,'Sirène 120 dB avec flash et batterie de secours intégrée.','Sirène extérieure auto-alimentée en coffret polycarbonate, puissance 120 dB, flash à LED et double autoprotection.','{"Puissance":"120 dB","Flash":"LED rouge","Batterie":"secours intégrée","Indice de protection":"IP54"}','alarme'),
('clavier-lcd-alarme','Clavier LCD partition alarme','INT-KLCD','satel','claviers',830.00,null,true,false,'Clavier LCD rétroéclairé pour centrales INTEGRA.','Clavier de commande LCD avec rétroéclairage réglable, lecture d''état des zones et programmation complète de la centrale.','{"Écran":"LCD 2x16 caractères","Rétroéclairage":"réglable","Compatibilité":"INTEGRA","Autoprotection":"oui"}','alarme'),
('centrale-cmsi-finsecur','Centrale de détection incendie adressable 2 boucles','FINSECUR-CDI2','finsecur','centrales-cmsi',null,null,true,false,'Centrale adressable 2 boucles, conforme EN 54.','Centrale de détection incendie adressable 2 boucles jusqu''à 250 points, conforme EN 54-2 et EN 54-4. Prix sur devis selon configuration du projet.','{"Boucles":"2","Points":"250 max","Norme":"EN 54-2 / EN 54-4","Alimentation":"secourue 24 V"}','incendie'),
('detecteur-optique-fumee','Détecteur optique de fumée adressable','FIN-DOF-A','finsecur','detecteurs-incendie',360.00,null,true,false,'Détecteur optique adressable avec socle inclus.','Détecteur optique de fumée adressable conforme EN 54-7, chambre d''analyse anti-poussière, socle de montage inclus.','{"Norme":"EN 54-7","Type":"optique adressable","Socle":"inclus","Voyant":"360°"}','incendie'),
('cable-incendie-resistant-feu','Câble résistant au feu 2x1,5 mm² (100 m)','CR1-C1-2X15','finsecur','cables-incendie',1250.00,null,true,false,'Couronne 100 m de câble CR1-C1 pour installations incendie.','Câble résistant au feu CR1-C1 pour liaisons de détection et d''alarme incendie. Couronne de 100 mètres.','{"Section":"2 x 1,5 mm²","Classement":"CR1-C1","Longueur":"100 m","Couleur":"rouge"}','incendie'),
('lecteur-badge-mifare','Lecteur de badge MIFARE étanche','BOSCH-LEC-M','bosch','lecteurs',740.00,null,true,false,'Lecteur MIFARE 13,56 MHz IP65 pour contrôle d''accès.','Lecteur de proximité MIFARE 13,56 MHz, boîtier étanche IP65, signal sonore et visuel, montage mural extérieur.','{"Technologie":"MIFARE 13,56 MHz","Indice de protection":"IP65","Interface":"Wiegand / OSDP","Distance de lecture":"5 cm"}','acces'),
('controleur-acces-2-portes','Contrôleur d''accès 2 portes IP','BOSCH-AMC2','bosch','controleurs',3600.00,null,true,false,'Contrôleur IP pour 2 portes avec gestion d''événements.','Contrôleur d''accès réseau pour 2 portes, mémoire locale des événements et fonctionnement autonome en cas de coupure réseau.','{"Portes":"2","Interface":"Ethernet","Mémoire":"100 000 événements","Alimentation":"12 V DC"}','acces'),
('projecteur-de-son-10w','Projecteur de son 10 W ligne 100 V','LBC-3432','bosch','projecteurs-de-son',390.00,null,true,false,'Projecteur de son 10 W en ligne 100 V pour extérieur.','Projecteur de son bidirectionnel 10 W ligne 100 V, boîtier aluminium résistant aux intempéries, étrier orientable.','{"Puissance":"10 W","Ligne":"100 V","Pression acoustique":"104 dB","Indice de protection":"IP65"}','sono'),
('projecteur-de-son-20w','Projecteur de son 20 W ligne 100 V','LBC-3440','bosch','projecteurs-de-son',620.00,720.00,true,false,'Projecteur de son 20 W haute portée pour grandes zones.','Projecteur de son 20 W ligne 100 V pour sonorisation de parkings, entrepôts et zones extérieures étendues.','{"Puissance":"20 W","Ligne":"100 V","Pression acoustique":"110 dB","Indice de protection":"IP65"}','sono'),
('haut-parleur-plafond-6w','Haut-parleur de plafond 6 W','LC1-UM06','bosch','haut-parleurs',210.00,null,true,false,'Haut-parleur encastrable 6 W pour sonorisation d''ambiance.','Haut-parleur de plafond 6 W ligne 100 V avec grille métallique blanche, idéal pour bureaux, commerces et halls.','{"Puissance":"6 W","Ligne":"100 V","Diamètre de découpe":"197 mm","Finition":"blanc"}','sono'),
('amplificateur-mixage-240w','Amplificateur-mélangeur 240 W','PLE-1MA240','bosch','amplificateurs',5400.00,null,true,false,'Amplificateur-mélangeur 240 W, 6 entrées, ligne 100 V.','Amplificateur-mélangeur 240 W pour installations de sonorisation publique, 6 entrées micro/ligne avec priorité.','{"Puissance":"240 W","Entrées":"6 micro/ligne","Sorties":"100 V / 70 V / 8 Ω","Format":"rack 2U"}','sono'),
('table-de-mixage-12-canaux','Table de mixage 12 canaux USB','MIX-12USB','bosch','tables-de-mixage',3100.00,null,false,false,'Console 12 canaux avec effets et interface USB.','Table de mixage analogique 12 canaux, alimentation fantôme 48 V, processeur d''effets intégré et interface USB pour enregistrement.','{"Canaux":"12","Alimentation fantôme":"48 V","Effets":"16 programmes","Interface":"USB stéréo"}','sono'),
('baie-19-pouces-27u','Baie 19 pouces 27U avec porte vitrée','RACK-27U-600','aten','racks',4700.00,null,true,false,'Baie rack 19" 27U 600x800 mm, porte vitrée verrouillable.','Baie serveur 19 pouces 27U, structure démontable, porte avant vitrée verrouillable, passages de câbles haut et bas.','{"Hauteur":"27U","Dimensions":"600 x 800 mm","Charge":"800 kg","Porte":"vitrée verrouillable"}','reseau'),
('videoprojecteur-laser-4k-8800l','Vidéoprojecteur laser 4K 8 800 lumens','ZU880-4K','optoma','videoprojecteurs',89500.00,null,true,true,'Projecteur laser 4K UHD 8 800 lumens pour grandes salles.','Vidéoprojecteur laser professionnel 4K UHD de 8 800 lumens, source lumineuse 20 000 heures sans entretien, objectifs interchangeables et installation 360°.','{"Résolution":"4K UHD (3840x2160)","Luminosité":"8 800 lumens","Source":"laser 20 000 h","Contraste":"2 000 000:1","Installation":"360° + portrait"}','av'),
('videoprojecteur-full-hd-4200l','Vidéoprojecteur Full HD 4 200 lumens','EH412','optoma','videoprojecteurs',9800.00,11200.00,true,false,'Projecteur Full HD lumineux pour salles de réunion.','Vidéoprojecteur Full HD 1080p de 4 200 lumens, compatible HDMI et connexion sans fil en option, idéal pour salles de réunion et de classe.','{"Résolution":"Full HD 1080p","Luminosité":"4 200 lumens","Contraste":"50 000:1","Connectique":"2 x HDMI, VGA, USB"}','av'),
('ecran-interactif-75-4k','Écran interactif 75" 4K tactile','ABSEN-IFP75','absen','ecrans-interactifs',42000.00,null,true,true,'Écran interactif tactile 75 pouces 4K, 20 points de contact.','Écran interactif 75 pouces 4K avec dalle antireflet, 20 points de contact, système Android intégré et logiciel de collaboration.','{"Taille":"75 pouces","Résolution":"4K UHD","Points de contact":"20","Système":"Android intégré","Connectique":"HDMI, USB-C, RJ45"}','av'),
('presentation-sans-fil-4k','Système de présentation sans fil 4K','LUMENS-WPS4K','lumens','presentation-sans-fil',7300.00,null,true,false,'Partage d''écran sans fil 4K jusqu''à 4 sources.','Système de présentation sans fil permettant à quatre participants de partager leur écran en 4K, sans installation de logiciel.','{"Résolution":"4K","Sources simultanées":"4","Compatibilité":"Windows, macOS, iOS, Android","Connexion":"WiFi / LAN"}','av'),
('camera-ptz-visioconference','Caméra PTZ visioconférence Full HD x20','LUMENS-VC-A50P','lumens','cameras-conference',18500.00,null,true,false,'Caméra PTZ Full HD zoom x20 pour salles de réunion.','Caméra PTZ professionnelle Full HD 60 ips avec zoom optique x20, sorties HDMI, 3G-SDI et IP streaming.','{"Résolution":"Full HD 60 ips","Zoom":"optique x20","Sorties":"HDMI, 3G-SDI, IP","Contrôle":"RS-232 / IP"}','av'),
('barre-visioconference-usb','Barre de visioconférence USB 4K','LUMENS-VS-B30','lumens','barres-conference',12400.00,null,true,false,'Barre tout-en-un 4K avec micros et haut-parleur intégrés.','Barre de visioconférence tout-en-un : caméra 4K grand angle, réseau de micros et haut-parleur, branchement USB plug and play.','{"Résolution":"4K","Champ de vision":"120°","Micros":"réseau 4 capsules","Connexion":"USB 3.0"}','av'),
('systeme-discussion-filaire','Système de discussion filaire (unité président)','BOSCH-CCS1000','bosch','systemes-discussion',null,null,true,false,'Unité de discussion président pour système de conférence.','Unité de discussion président du système de conférence numérique, enregistrement intégré et gestion des priorités. Prix sur devis selon le nombre de postes.','{"Type":"unité président","Enregistrement":"USB intégré","Postes max":"80","Câblage":"boucle propriétaire"}','av'),
('switch-kvm-8-ports-aten','Switch KVM 8 ports HDMI USB','CS1798','aten','kvm',6800.00,7500.00,true,false,'KVM 8 ports HDMI 4K avec audio et hub USB 2.0.','Switch KVM 8 ports HDMI permettant de piloter 8 ordinateurs depuis un seul clavier, écran et souris. Résolution 4K et hub USB 2.0 intégré.','{"Ports":"8","Vidéo":"HDMI 4K 30 Hz","USB":"hub 2.0","Commutation":"boutons, raccourcis clavier, OSD"}','reseau'),
('coffret-mural-9u','Coffret mural 19 pouces 9U','RACK-9U-450','aten','coffrets-baies',1850.00,null,true,false,'Coffret mural 9U profondeur 450 mm, porte vitrée.','Coffret mural 19 pouces 9U avec porte vitrée verrouillable, panneaux latéraux démontables et passages de câbles.','{"Hauteur":"9U","Profondeur":"450 mm","Charge":"60 kg","Montage":"mural"}','reseau'),
('panneau-brassage-24-ports','Panneau de brassage 24 ports Cat 6','PATCH-24-C6','aten','precablage',890.00,null,true,false,'Panneau de brassage 19" 24 ports Cat 6 blindé.','Panneau de brassage 19 pouces 1U, 24 ports Cat 6, avec guide-câbles arrière et étiquetage.','{"Ports":"24","Catégorie":"Cat 6","Format":"19 pouces 1U","Blindage":"FTP"}','reseau');
