import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function SessionManager() {
  const navigate = useNavigate();

  const handleOnIdle = () => {
    localStorage.removeItem('user');
    Swal.fire({
      title: 'Sesi Berakhir',
      text: 'Sesi Anda telah berakhir karena tidak aktif.',
      icon: 'warning',
      confirmButtonText: 'OK'
    }).then(() => {
      navigate('/login');
    });
  };

  useIdleTimer({
    timeout: 1000 * 60 * 15, // 15 menit
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return null;
}
