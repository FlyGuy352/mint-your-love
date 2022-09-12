import HeroImage from '../components/HeroImage';
import Image from 'next/image';
import mealImg from '../public/assets/images/meal.jpg';

export default function Home() {
  return (
    <>
      <HeroImage />

      <div className='pt-10 grid md:grid-cols-3 mx-auto w-4/5 gap-6'>
        <div>
          <Image src={mealImg} alt='' height='305' width='428' />
        </div>
        <div>
          <Image src={mealImg} alt='' height='305' width='428' />
        </div>
        <div>
          <Image src={mealImg} alt='' height='305' width='428' />
        </div>
      </div>
    </>
  );
}
