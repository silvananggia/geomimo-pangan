import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../../actions/authActions";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user ? user.name : null;
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogout = () => {
    Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    Swal.fire({
      title: "Konfirmasi",
      text: "Yakin akan keluar dari GEOMIMO?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked "No, cancel!" or closed the modal
        return;
      }
    });
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/469fc9c3b72499528f6a0413e43b45421fb0bda3?placeholderIfAbsent=true"
          alt="Logo BRIN"
          className="logo"
        />
      </div>
      <nav className="navigation">
        <a href="/katalog-modul" className="nav-item">
          Katalog Modul
        </a>
        <a href="/tentang" className="nav-item">
          Tentang Kami
        </a>
        <a href="/kontak" className="nav-item">
          Kontak
        </a>
        {userEmail ? (
          <div className="user-info">
            <span>{userEmail}</span>
            <a className="nav-button" onClick={handleLogout}>
              Logout
            </a>
          </div>
        ) : (
          <>
            <a href="/login" className="nav-item">
              Login
            </a>
            <a href="/register" className="nav-button">
              Daftar
            </a>
          </>
        )}
      </nav>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 21px 40px;
          background-color: #f1f1f1;
        }

        .logo {
          width: 116px;
          height: 45px;
        }

        .navigation {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-item {
          font-family: "Lato", sans-serif;

          color: #205072;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          padding: var(--button-md-button-vp, 16px)
            var(--button-md-button-hp, 32px);
          justify-content: flex-end;
          align-items: center;
          gap: var(--button-md-button-hg, 10px);
        }

        .user-info {
          font-family: "Lato", sans-serif;

          color: #205072;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          padding: var(--button-md-button-vp, 16px)
            var(--button-md-button-hp, 32px);
          justify-content: flex-end;
          align-items: center;
          gap: var(--button-md-button-hg, 10px);
        }

        .nav-button {
          font-family: "Lato", sans-serif;
          font-size: 16px;
          color: #f1f1f1;
          cursor: pointer;
          padding: 16px 32px;
          border-radius: 8px;
          background-color: #205072;
          text-decoration: none;
        }

        @media (max-width: 991px) {
          .navigation {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
