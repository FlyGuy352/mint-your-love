import HeroImage from '../components/HeroImage';
import Image from 'next/image';
import mealImg from '../public/assets/images/meal.jpg';
import handsImg from '../public/assets/images/holding_hands.jpg';
import fireworksImg from '../public/assets/images/fireworks.jpg';
import bedImg from '../public/assets/images/bed.webp';
import dateImg from '../public/assets/images/date.jpeg';
import chocolatesImg from '../public/assets/images/chocolates.jpeg';

export default function Home() {
  return (
    <>
      <HeroImage />

      <div className='pt-10 grid md:grid-cols-3 mx-auto w-4/5 gap-6'>
        <div>
          <Image src={mealImg} alt='' height='305' width='428' />
        </div>
        <div>
          <Image src={handsImg} alt='' height='305' width='428' />
        </div>
        <div>
          <Image src={fireworksImg} alt='' height='305' width='428' />
        </div>
        <div>
          <Image src={bedImg} alt='' height='305' width='428' />
        </div>
        <div>
          <Image src={dateImg} alt='' height='305' width='428' />
        </div>
        <div>
          <Image src={chocolatesImg} alt='' height='305' width='428' />
        </div>
      </div>
    </>
  );
}
