import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'Phoenix - Rising from the Ashes | Advice for Life',
  description: 'Recovery. California. Texas. Building a new life from the ruins.',
};

export default function PhoenixGallery() {
  const photos = [
    { filename: '01_phoenix_rise.jpg', caption: 'Rising from the ashes' },
    { filename: '02_new_beginning.jpg', caption: 'A new beginning' },
    { filename: '03_working_man.jpg', caption: 'The working man' },
    { filename: '04_recovery.jpg', caption: 'Recovery days' },
    { filename: '05_building_life.jpg', caption: 'Building a new life' },
    { filename: '06_phoenix_flying.jpg', caption: 'Phoenix flying' },
    { filename: '07_clean_sober.jpg', caption: 'Clean and sober' },
    { filename: '08_outdoors.jpg', caption: 'Outdoors' },
    { filename: '09_new_brandon.jpg', caption: 'The new Brandon' },
    { filename: '10_phoenix_power.jpg', caption: 'Phoenix power' },
    { filename: '11_working_hard.jpg', caption: 'Working hard' },
    { filename: '12_rising_up.jpg', caption: 'Rising up' },
    { filename: '13_phoenix_strong.jpg', caption: 'Phoenix strong' },
    { filename: '14_new_life.jpg', caption: 'New life' },
    { filename: '15_brandon_today.jpg', caption: 'Brandon today' },
    { filename: '16_disc_golf.jpg', caption: 'Disc golf' },
    { filename: '17_nature.jpg', caption: 'Nature' },
    { filename: '18_recovery_life.jpg', caption: 'Recovery life' },
    { filename: '19_phoenix_wings.jpg', caption: 'Phoenix wings' },
    { filename: '20_building_empire.jpg', caption: 'Building the empire' },
    { filename: '21_disc_golf_park.jpg', caption: 'Disc golf park' },
    { filename: '22_fishing_trip.jpg', caption: 'Fishing trip' },
    { filename: '23_social_recovery.jpg', caption: 'Social recovery' },
  ];

  return (
    <PhotoGallery
      title="Phoenix"
      subtitle="Rising from the Ashes - Recovery, California, Texas, and building an empire from the ruins"
      photos={photos}
      galleryPath="phoenix"
    />
  );
}
