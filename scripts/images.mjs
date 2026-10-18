import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'assets/img-src';
const OUT_DIR = 'assets/img';
const OG_DIR = path.join(OUT_DIR, 'og');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}
if (!fs.existsSync(OG_DIR)) {
  fs.mkdirSync(OG_DIR, { recursive: true });
}

const WIDTHS = [480, 800, 1200, 1600];

const CARD_JOBS = [
  { src: 'theros_brand_article.jpg', name: 'theros-pro-slim-card-4x3' },
  { src: 'theros_brand_page_withlogo_crop.jpg', name: 'theros-pro-slim-page-4x3' },
  { src: 'pacific-waterheater-poster.jpg', name: 'pacific-water-heater-card-4x3' },
  { src: 'eurogas-boiler.jpg', name: 'eurogas-boiler-card-4x3' },
  { src: 'nerobel-tech-showcase.jpg', name: 'nerobel-tech-card-4x3' }
];

async function processCardJobs() {
  for (const job of CARD_JOBS) {
    const inputPath = path.join(SRC_DIR, job.src);
    console.log(`Processing card job: ${job.name} from ${job.src}`);

    for (const width of WIDTHS) {
      const height = Math.round(width * 3 / 4);
      const resizer = sharp(inputPath).resize(width, height, { fit: 'cover', position: 'attention' });

      // WebP
      const webpOut = path.join(OUT_DIR, `${job.name}-${width}.webp`);
      await resizer.clone().webp({ quality: 82 }).toFile(webpOut);

      // AVIF
      const avifOut = path.join(OUT_DIR, `${job.name}-${width}.avif`);
      await resizer.clone().avif({ quality: 72 }).toFile(avifOut);
    }

    // Default base versions (1200x900)
    const baseHeight = 900;
    const baseResizer = sharp(inputPath).resize(1200, baseHeight, { fit: 'cover', position: 'attention' });
    await baseResizer.clone().webp({ quality: 82 }).toFile(path.join(OUT_DIR, `${job.name}.webp`));
    await baseResizer.clone().avif({ quality: 72 }).toFile(path.join(OUT_DIR, `${job.name}.avif`));
    await baseResizer.clone().jpeg({ quality: 78 }).toFile(path.join(OUT_DIR, `${job.name}.jpg`));
  }
}

async function processBannerJobs() {
  const inputPath = path.join(SRC_DIR, 'nerobel-banner-appliances.jpg');

  // 16:9 banner
  console.log('Processing 16:9 banner: nerobel-appliances-banner-16x9');
  for (const width of WIDTHS) {
    const height = Math.round(width * 9 / 16);
    const resizer = sharp(inputPath).resize(width, height, { fit: 'cover', position: 'attention' });

    const webpOut = path.join(OUT_DIR, `nerobel-appliances-banner-16x9-${width}.webp`);
    await resizer.clone().webp({ quality: 82 }).toFile(webpOut);

    const avifOut = path.join(OUT_DIR, `nerobel-appliances-banner-16x9-${width}.avif`);
    await resizer.clone().avif({ quality: 72 }).toFile(avifOut);
  }
  const base169 = sharp(inputPath).resize(1200, 675, { fit: 'cover', position: 'attention' });
  await base169.clone().webp({ quality: 82 }).toFile(path.join(OUT_DIR, 'nerobel-appliances-banner-16x9.webp'));
  await base169.clone().avif({ quality: 72 }).toFile(path.join(OUT_DIR, 'nerobel-appliances-banner-16x9.avif'));
  await base169.clone().jpeg({ quality: 82 }).toFile(path.join(OUT_DIR, 'nerobel-appliances-banner-16x9.jpg'));

  // 4:5 mobile crop
  console.log('Processing 4:5 mobile crop banner: nerobel-appliances-banner-4x5');
  for (const width of WIDTHS) {
    const height = Math.round(width * 5 / 4);
    const resizer = sharp(inputPath).resize(width, height, { fit: 'cover', position: 'attention' });

    const webpOut = path.join(OUT_DIR, `nerobel-appliances-banner-4x5-${width}.webp`);
    await resizer.clone().webp({ quality: 82 }).toFile(webpOut);

    const avifOut = path.join(OUT_DIR, `nerobel-appliances-banner-4x5-${width}.avif`);
    await resizer.clone().avif({ quality: 72 }).toFile(avifOut);
  }
  const base45 = sharp(inputPath).resize(800, 1000, { fit: 'cover', position: 'attention' });
  await base45.clone().webp({ quality: 82 }).toFile(path.join(OUT_DIR, 'nerobel-appliances-banner-4x5.webp'));
  await base45.clone().avif({ quality: 72 }).toFile(path.join(OUT_DIR, 'nerobel-appliances-banner-4x5.avif'));
  await base45.clone().jpeg({ quality: 82 }).toFile(path.join(OUT_DIR, 'nerobel-appliances-banner-4x5.jpg'));
}

async function run() {
  await processCardJobs();
  await processBannerJobs();
  console.log('Image pipeline complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
