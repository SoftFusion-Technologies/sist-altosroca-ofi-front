import { FaRegSadTear } from 'react-icons/fa';
import NavbarStaff from '../../../staff/NavbarStaff';
import ParticlesBackground from '../../../../Components/ParticlesBackground';
import ButtonBack from '../../../../Components/ButtonBack';

const SinFeedback = ({
  mensaje = 'Todavía no se ha recibido ningún comentario.'
}) => {

  return (
    <>
      <NavbarStaff />
      <ParticlesBackground />

      <div className="bg-gradient-to-b from-purple-950 via-purple-900 to-purple-800 min-h-screen py-16 px-4 sm:px-8 md:px-12">
        <div className="flex flex-col items-center justify-center text-center text-white px-4 gap-6">
          <div className="bg-gradient-to-tr from-purple-800 via-purple-700 to-purple-900 p-8 rounded-2xl shadow-2xl border border-purple-600 max-w-md w-full">
            <FaRegSadTear className="text-6xl text-purple-300 mb-5 animate-[bounce_2s_infinite]" />
            <h3 className="text-3xl font-extrabold mb-3">Sin Feedbacks</h3>
            <p className="text-base text-purple-200 leading-relaxed">{mensaje}</p>
          </div>

          <ButtonBack></ButtonBack>
        </div>
      </div>
    </>
  );
};

export default SinFeedback;
