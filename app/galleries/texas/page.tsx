import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'Texas - The Phoenix | Advice for Life',
  description: 'Rising from the ashes',
};

export default function TexasGallery() {
  const photos = [
    { filename: '03_working_man.jpg', caption: 'Texas' },
    { filename: '04_recovery.jpg', caption: 'Texas' },
    { filename: '06_phoenix_flying.jpg', caption: 'Texas' },
    { filename: '07_clean_sober.jpg', caption: 'Texas' },
    { filename: '09_new_brandon.jpg', caption: 'Texas' },
    { filename: '10_phoenix_power.jpg', caption: 'Texas' },
    { filename: '11_working_hard.jpg', caption: 'Texas' },
    { filename: '14_new_life.jpg', caption: 'Texas' },
    { filename: '15_brandon_today.jpg', caption: 'Texas' },
    { filename: '18_recovery_life.jpg', caption: 'Texas' },
    { filename: '19_phoenix_wings.jpg', caption: 'Texas' },
    { filename: '203348644_4768212489860215_4466212003977914736_n.jpg', caption: 'Texas' },
    { filename: '20_building_empire.jpg', caption: 'Texas' },
    { filename: '21_disc_golf_park.jpg', caption: 'Texas' },
    { filename: '22_fishing_trip.jpg', caption: 'Texas' },
    { filename: '23_social_recovery.jpg', caption: 'Texas' },
    { filename: 'IMG_0093.jpg', caption: 'Texas' },
  ];

  return (
    <PhotoGallery
      title="Texas - The Phoenix"
      subtitle="Rising from the ashes"
      photos={photos}
      galleryPath="texas"
    />
  );
}
