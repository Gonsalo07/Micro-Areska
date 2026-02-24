import { Divider } from "@nextui-org/divider";

interface Props {
  children: React.ReactNode;
}

export const AuthLayoutWrapper = ({ children }: Props) => {
  return (
    <div className='flex h-screen'>
      <div className='flex-1 flex-col flex items-center justify-center p-6 relative'>
        <div className='md:hidden absolute inset-0 z-0'>
          <img
            className='w-full h-full object-cover'
            src='/moto-wp.jpg'
            alt='moto delivery'
          />
        </div>
        {children}
      </div>

      <div className='hidden my-10 md:block'>
        <Divider orientation='vertical' />
      </div>

      <div className='hidden md:flex flex-1 relative flex-col p-6 overflow-hidden'>
        <img
          className='absolute inset-0 w-full h-full object-cover'
          src='/moto-wp.jpg'
          alt='moto delivery'
        />
        <div className='z-10 relative'>
          <h1 className='font-bold text-[32px] text-white drop-shadow-lg'>Areska Driver</h1>
        </div>
      </div>
    </div>
  );
};
