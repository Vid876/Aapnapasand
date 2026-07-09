export const BRAND = {
  name: "BOHOBLOCKPRINTED",
  headline: "Hand Block Printed Home Decor, Fashion & Accessories",
  subheadline: "Authentic Artisan-Made Textiles from Jaipur, India",
  description:
    "Premium hand block printed home decor, table linen, fashion, accessories, fabric by yard, custom orders, and wholesale textiles made with artisan craft in Jaipur, Rajasthan, India.",
  email: "support@bohoblockprinted.com",
  phoneDisplay: "+91 89553 79671",
  phoneHref: "tel:+918955379671",
  location: "Jaipur, Rajasthan, India",
  url: "https://www.bohoblockprinted.com",
  instagram: "https://www.instagram.com/bohoblockprinted/",
  pinterest: "https://in.pinterest.com/thecottonduvet/",
  etsy: "https://www.etsy.com/shop/coloursofspirit",
} as const;

export const TOP_BAR_MESSAGES = [
  "Handmade in Jaipur",
  "Worldwide Shipping",
  "Wholesale Available",
  "Custom Orders Welcome",
  "Get 10% Off Your First Order",
] as const;

export const CATEGORY_GROUPS = [
  {
    name: "Home Linen",
    slug: "home-linen",
    href: "/home-linen",
    image: "/uploads/0bc7ea6a-63ec-4f94-b172-cedeeb3e05bb.jpg",
    description:
      "Block printed bedding and soft furnishings for layered bedrooms, guest rooms, and boutique hospitality spaces.",
    keywords: "hand block printed duvet covers, block print bed sheets, cotton pillow covers, Jaipur curtains",
    subcategories: [
      { name: "Duvet Covers", slug: "duvet-covers", href: "/shop?category=duvet-covers" },
      { name: "Bed Sheets", slug: "bed-sheets", href: "/shop?category=bed-sheets" },
      { name: "Pillow Covers", slug: "pillow-covers", href: "/shop?category=pillow-covers" },
      { name: "Curtains", slug: "curtains", href: "/shop?category=curtains" },
    ],
  },
  {
    name: "Table Linen",
    slug: "table-linen",
    href: "/table-linen",
    image: "/uploads/35b92bf7-8b77-4d97-aa17-08c098563992.jpg",
    description:
      "Napkins, tablecloths, and runners for restaurants, gifting, weddings, and everyday tables with a handmade textile story.",
    keywords: "hand block printed napkins, block print tablecloths, cotton table runners",
    subcategories: [
      { name: "Napkins", slug: "napkins", href: "/shop?category=napkins" },
      { name: "Tablecloths", slug: "tablecloths", href: "/shop?category=tablecloths" },
      { name: "Table Runners", slug: "table-runners", href: "/shop?category=table-runners" },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    href: "/fashion",
    image: "/uploads/81df845a-7e09-4d19-8ec9-d2070af19f80.jpg",
    description:
      "Relaxed artisan fashion in breathable prints, including kaftans, sarongs, and beach cover-ups.",
    keywords: "cotton kaftans, block print sarongs, hand block printed beach cover ups",
    subcategories: [
      { name: "Kaftans", slug: "kaftans", href: "/shop?category=kaftans" },
      { name: "Sarongs", slug: "sarongs", href: "/shop?category=sarongs" },
      { name: "Beach Cover-Ups", slug: "beach-cover-ups", href: "/shop?category=beach-cover-ups" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    href: "/accessories",
    image: "/uploads/2cb32606-e0ed-4c52-a7bf-9fdd6c611a46.jpg",
    description:
      "Small-batch printed accessories for travel, gifting, boutique shelves, and daily use.",
    keywords: "block print bandanas, quilted tote bags, cosmetic bags, duffle bags",
    subcategories: [
      { name: "Bandanas", slug: "bandanas", href: "/shop?category=bandanas" },
      { name: "Quilted Tote Bags", slug: "quilted-tote-bags", href: "/shop?category=quilted-tote-bags" },
      { name: "Cosmetic Bags", slug: "cosmetic-bags", href: "/shop?category=cosmetic-bags" },
      { name: "Duffle Bags", slug: "duffle-bags", href: "/shop?category=duffle-bags" },
    ],
  },
  {
    name: "Fabric",
    slug: "fabric",
    href: "/fabric",
    image: "/uploads/dadf4cf8-da12-4c5c-ba03-991e68a258af.jpg",
    description:
      "Block print fabric by yard for designers, makers, small brands, and custom textile projects.",
    keywords: "block print fabric by yard, Jaipur printed cotton fabric, hand block printed fabric",
    subcategories: [
      { name: "Block Print Fabric by Yard", slug: "block-print-fabric-by-yard", href: "/shop?category=block-print-fabric-by-yard" },
    ],
  },
] as const;

export const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  ...CATEGORY_GROUPS.map((category) => ({
    label: category.name,
    href: category.href,
    children: category.subcategories.map((item) => ({ label: item.name, href: item.href })),
  })),
  { label: "Wholesale", href: "/wholesale" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const QUICK_LINK_BLOCKS = [
  {
    title: "About Us",
    href: "/about",
    image: "/uploads/03cd6105-7d88-47a4-a9bd-71e5f5091c0a.jpg",
    text: "Meet the Jaipur textile story behind the brand.",
  },
  {
    title: "Contact",
    href: "/contact",
    image: "/uploads/178300f0-6701-4689-b622-58ec74d604e9.jpg",
    text: "Ask about orders, custom work, or wholesale needs.",
  },
  {
    title: "Wholesale",
    href: "/wholesale",
    image: "/uploads/20a9b9e3-862f-4acb-858c-6a7ec0bdf93a.png",
    text: "Bulk production, private label, and catalog requests.",
  },
  {
    title: "Fabric",
    href: "/fabric",
    image: "/uploads/dadf4cf8-da12-4c5c-ba03-991e68a258af.jpg",
    text: "Printed cotton and linen yardage for makers.",
  },
  {
    title: "Accessories",
    href: "/accessories",
    image: "/uploads/2cb32606-e0ed-4c52-a7bf-9fdd6c611a46.jpg",
    text: "Bandanas, quilted bags, and travel pieces.",
  },
  {
    title: "Fashion",
    href: "/fashion",
    image: "/uploads/81df845a-7e09-4d19-8ec9-d2070af19f80.jpg",
    text: "Kaftans, sarongs, and relaxed printed wear.",
  },
] as const;

export const SHOP_CATEGORY_TILES = [
  { name: "Duvet Covers", slug: "duvet-covers", image: "/uploads/0bc7ea6a-63ec-4f94-b172-cedeeb3e05bb.jpg" },
  { name: "Bed Sheets", slug: "bed-sheets", image: "/uploads/30a06f5d-9226-4e4d-8e71-eef29ae601c3.jpg" },
  { name: "Napkins", slug: "napkins", image: "/uploads/35b92bf7-8b77-4d97-aa17-08c098563992.jpg" },
  { name: "Tablecloths", slug: "tablecloths", image: "/uploads/43d65792-c105-4a36-af1d-6c62856f818b.jpg" },
  { name: "Bandanas", slug: "bandanas", image: "/uploads/2cb32606-e0ed-4c52-a7bf-9fdd6c611a46.jpg" },
  { name: "Quilted Tote Bags", slug: "quilted-tote-bags", image: "/uploads/57ae2da7-67bf-45c2-bff8-09c3a59124d8.jpg" },
  { name: "Kaftans", slug: "kaftans", image: "/uploads/81df845a-7e09-4d19-8ec9-d2070af19f80.jpg" },
  { name: "Sarongs", slug: "sarongs", image: "/uploads/805b0cdc-5323-40fd-a383-802163946237.jpg" },
  { name: "Fabric by Yard", slug: "block-print-fabric-by-yard", image: "/uploads/dadf4cf8-da12-4c5c-ba03-991e68a258af.jpg" },
] as const;

export const WHY_CHOOSE = [
  "Handmade in Jaipur",
  "Traditional Hand Block Printing",
  "Natural Cotton & Linen Fabrics",
  "Worldwide Shipping",
  "Custom & Wholesale Orders Available",
  "Trusted by Thousands of Customers",
] as const;

export const PROCESS_STEPS = [
  {
    title: "Block Carving",
    text: "Motifs are translated into wooden blocks that carry the repeat, border, and placement language of the print.",
    image: "/uploads/03cd6105-7d88-47a4-a9bd-71e5f5091c0a.jpg",
  },
  {
    title: "Fabric Preparation",
    text: "Cotton and linen fabrics are prepared so the surface is ready for crisp, even hand printing.",
    image: "/uploads/dadf4cf8-da12-4c5c-ba03-991e68a258af.jpg",
  },
  {
    title: "Hand Printing",
    text: "Artisans align the blocks by hand, building the design through pressure, rhythm, and practiced placement.",
    image: "/uploads/0bc7ea6a-63ec-4f94-b172-cedeeb3e05bb.jpg",
  },
  {
    title: "Washing",
    text: "Printed fabric is washed and finished according to the fabric and dye process so the textile is ready for use.",
    image: "/uploads/35b92bf7-8b77-4d97-aa17-08c098563992.jpg",
  },
  {
    title: "Stitching",
    text: "The fabric becomes finished home linen, table linen, fashion, accessories, or custom wholesale pieces.",
    image: "/uploads/81df845a-7e09-4d19-8ec9-d2070af19f80.jpg",
  },
  {
    title: "Quality Inspection",
    text: "Each piece is checked for finishing, measurements, packing readiness, and the natural character of hand work.",
    image: "/uploads/2cb32606-e0ed-4c52-a7bf-9fdd6c611a46.jpg",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Boutique Buyer",
    location: "California, USA",
    quote:
      "The prints feel handmade and elevated. Our customers respond to the story, the cotton, and the color combinations.",
  },
  {
    name: "Home Linen Customer",
    location: "Mumbai, India",
    quote:
      "The bedding changed the whole room. It has the charm of craft without feeling too delicate for daily use.",
  },
  {
    name: "Wholesale Partner",
    location: "Australia",
    quote:
      "Sampling and custom sizing were easy to discuss, and the textile range gave us enough variety for a cohesive edit.",
  },
] as const;

export const INSTAGRAM_POSTS = [
  {
    title: "Table textiles",
    text: "Printed napkins, runners, and tablecloths for layered dining.",
    href: BRAND.instagram,
    image: "/uploads/35b92bf7-8b77-4d97-aa17-08c098563992.jpg",
  },
  {
    title: "Quilted bags",
    text: "Soft accessories with artisan pattern and travel utility.",
    href: BRAND.instagram,
    image: "/uploads/57ae2da7-67bf-45c2-bff8-09c3a59124d8.jpg",
  },
  {
    title: "Wholesale updates",
    text: "Fresh catalog drops and bulk-order highlights.",
    href: BRAND.instagram,
    image: "/uploads/20a9b9e3-862f-4acb-858c-6a7ec0bdf93a.png",
  },
] as const;

export const BLOG_POSTS = [
  {
    title: "What is Hand Block Printing?",
    slug: "what-is-hand-block-printing",
    description:
      "A practical introduction to the carving, printing, washing, and finishing steps behind hand block printed textiles.",
    keywords: "what is hand block printing, Jaipur hand block print process",
    sections: [
      "Hand block printing is a textile process where carved blocks are pressed onto fabric by hand to build a repeat, border, or placement print.",
      "The charm comes from human rhythm: slight shifts, pressure marks, and tonal movement show that each textile has passed through skilled hands.",
      "For buyers, this means every piece should be read as artisan-made rather than machine-perfect.",
    ],
  },
  {
    title: "Block Print vs Screen Print",
    slug: "block-print-vs-screen-print",
    description:
      "How hand block printing differs from screen printing in look, production rhythm, and textile character.",
    keywords: "block print vs screen print, hand block printed fabric",
    sections: [
      "Screen printing can be fast and consistent, while hand block printing is slower and more tactile.",
      "Block printed textiles often show small variations in alignment and color pressure, which are part of the handmade surface.",
      "Choose block print when the craft story, touch, and human variation matter to the product.",
    ],
  },
  {
    title: "How to Style a Bandana",
    slug: "how-to-style-a-bandana",
    description:
      "Simple ways to use a block print bandana as a neck scarf, bag accent, hair tie, or travel accessory.",
    keywords: "how to style a bandana, block print bandana",
    sections: [
      "Tie a printed bandana at the neck with a plain shirt or kaftan for an easy accent.",
      "Wrap it around a tote handle to bring pattern into a neutral outfit.",
      "Use it as a hair tie, head scarf, or travel pouch marker when you want a small piece of textile color.",
    ],
  },
  {
    title: "Benefits of Quilted Tote Bags",
    slug: "benefits-of-quilted-tote-bags",
    description:
      "Why quilted cotton totes work for markets, travel, gifting, and boutique accessory edits.",
    keywords: "quilted tote bags, block print tote bag benefits",
    sections: [
      "A quilted tote gives soft structure without making the bag feel heavy.",
      "Block printed cotton adds surface interest, which makes the bag useful as both accessory and everyday carry.",
      "For wholesale buyers, quilted totes can sit beside cosmetic bags, duffles, and bandanas as a coordinated accessory story.",
    ],
  },
  {
    title: "How to Care for Linen Bedding",
    slug: "how-to-care-for-linen-bedding",
    description:
      "Care guidance for printed bedding so colors, seams, and fabric texture last longer.",
    keywords: "how to care for linen bedding, block print bedding care",
    sections: [
      "Wash printed bedding gently in cold water with mild detergent and avoid harsh bleach.",
      "Dry in shade where possible to protect color and fabric surface.",
      "Natural cotton and linen soften over time, so careful washing helps the textile age beautifully.",
    ],
  },
  {
    title: "Decorating with Block Print Home Textiles",
    slug: "decorating-with-block-print-home-textiles",
    description:
      "How to layer block print bedding, curtains, table linen, and cushions without overwhelming a room.",
    keywords: "decorating with block print textiles, block print home decor",
    sections: [
      "Start with one hero print, then layer smaller scale motifs or solids around it.",
      "Use table linen and bedding to introduce color seasonally without changing the whole room.",
      "A repeated color thread across napkins, bedding, and curtains makes handmade textiles feel intentional.",
    ],
  },
] as const;

export const WHOLESALE_FIELDS = [
  "Business name",
  "Contact name",
  "Email address",
  "Country",
  "Product interest",
  "Estimated quantity or MOQ question",
  "Custom sizing, private label, or catalog request",
] as const;
