-- Seed products for Drunken Arsenal

-- Shot Wave Game (Main Product)
INSERT INTO "Product" ("id", "name", "slug", "description", "price", "category", "stock", "images", "featured")
VALUES (
  'shot-wave-game',
  'Shot Wave',
  'shot-wave-game',
  'The ultimate tactical drinking game. Deploy your shots, dodge incoming fire, and outmaneuver your opponents in this military-inspired party game.',
  4999,
  'game',
  100,
  ARRAY['/placeholder.svg?height=600&width=600'],
  true
) ON CONFLICT ("id") DO NOTHING;

-- Shells (Accessories)
INSERT INTO "Product" ("id", "name", "slug", "description", "price", "category", "stock", "images", "featured")
VALUES (
  'artillery-shells-6pack',
  'Artillery Shells - 6 Pack',
  'artillery-shells-6pack',
  'Premium shot glass shells designed for maximum impact. Rugged construction for intense party operations.',
  1499,
  'accessory',
  200,
  ARRAY['/placeholder.svg?height=600&width=600'],
  true
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Product" ("id", "name", "slug", "description", "price", "category", "stock", "images", "featured")
VALUES (
  'artillery-shells-12pack',
  'Artillery Shells - 12 Pack',
  'artillery-shells-12pack',
  'Double the firepower. Stock up for extended missions with this tactical 12-pack of premium shot glass shells.',
  2499,
  'accessory',
  150,
  ARRAY['/placeholder.svg?height=600&width=600'],
  false
) ON CONFLICT ("id") DO NOTHING;

-- Mines (Accessories)
INSERT INTO "Product" ("id", "name", "slug", "description", "price", "category", "stock", "images", "featured")
VALUES (
  'tactical-mines-4pack',
  'Tactical Mines - 4 Pack',
  'tactical-mines-4pack',
  'Strategic drinking obstacles. Place these tactical mines on the battlefield and watch your opponents navigate carefully.',
  999,
  'accessory',
  180,
  ARRAY['/placeholder.svg?height=600&width=600'],
  false
) ON CONFLICT ("id") DO NOTHING;

-- Bundles
INSERT INTO "Product" ("id", "name", "slug", "description", "price", "category", "stock", "images", "featured")
VALUES (
  'basic-deployment-bundle',
  'Basic Deployment Bundle',
  'basic-deployment-bundle',
  'Everything you need for your first mission: Shot Wave game + 6 Artillery Shells. Save 15% compared to buying separately.',
  5999,
  'bundle',
  75,
  ARRAY['/placeholder.svg?height=600&width=600'],
  true
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Product" ("id", "name", "slug", "description", "price", "category", "stock", "images", "featured")
VALUES (
  'full-arsenal-bundle',
  'Full Arsenal Bundle',
  'full-arsenal-bundle',
  'Go all in. Shot Wave game + 12 Artillery Shells + 4 Tactical Mines. Complete tactical superiority. Save 20%.',
  7999,
  'bundle',
  50,
  ARRAY['/placeholder.svg?height=600&width=600'],
  true
) ON CONFLICT ("id") DO NOTHING;
