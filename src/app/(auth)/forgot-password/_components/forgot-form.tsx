"use client";
import { Button, Paper, TextInput, Title, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';

import css from './forgot-form.module.css'


import { IconBrandReact } from "@tabler/icons-react";
import "./stylos/home.css";
import im1 from './imagenes/im1.png'; 
import logo from './imagenes/logo.png';

// Estilos adicionales para fondo blanco y nav verde
const additionalStyles = {
    pageContainer: {
      backgroundColor: 'white',
      minHeight: '100vh',
      width: '100%'
    }
  };

export default function ForgotForm() {
    const [showNotification, setShowNotification] = useState(false);
    const [email, setEmail] = useState('');

    const handleClick = () => {
        setShowNotification(true); // Mostrar notificación
        setTimeout(() => setShowNotification(false), 3000); // Ocultar después de 3 segundos
        setEmail(''); 
      };

    return (
        <div style={additionalStyles.pageContainer}>
            {/* Header Section */}
            <div className="header">
                <div className="brand">
                    <div className="brand-logo">
                    <img src={logo.src} className="imlogo"></img>
                    </div>
                    <div className="brand-name">CropMS</div>
                </div>
                <div className="nav">
                    <a href="#">Inicio</a>
                    <a href="#">Soporte</a>
                </div>
            </div>

            {/* Container Section */}
            <div className="container">
                <div className="content-wrapper">
                    <div className="left-content">
                        <img src={im1.src} alt="CropMS Logo" className="main-logo" />
                        
                        <div className="welcome-message">
                            <h1 className="welcome-title">Bienvenidos a su Frutería y Verdulería favorita!</h1>
                            <p className="welcome-subtitle">
                                Descubre la frescura y calidad de nuestros productos. Desde frutas exóticas hasta verduras frescas, 
                                tenemos todo lo que necesitas para una alimentación saludable.
                            </p>
                        </div>
                    </div>

                    {/* Right Content (Login Form) */}
                    <div className="right-content">
                        <div className="login-form">
                            <h2 className="login-title">Restablecer Contraseña</h2>
                            
                            <div className="form-group">
                                <label className="form-label">Ingresa tu Correo Electronico:</label>
                                <input  type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            
                            <button className="form-button" onClick={handleClick}>
                                
                                Enviar
                                <span>→</span>
                            </button> 

                            <Text ta="center" mt="md">
                                 ¿Ya Tienes tu Contraseña?{' '}
                                <Anchor component={Link} href="/login" fw={700} style={{ color: "#2ecc40" }}>
                                    Iniciar Sesión
                                </Anchor>
                            </Text>
                        </div>
                    </div>
                </div>

                {showNotification && (
        <div className="notification">
          Se ha enviado el enlace de restablecimiento al correo
        </div>
      )}

                {/* Social Media Icons */}
                <div className="social-media">
                    <a href="#" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                        </svg>
                    </a>
                    <a href="#" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"></path>
                        </svg>
                    </a>
                    <a href="#" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
                