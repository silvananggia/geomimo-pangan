import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from "../components/layouts/loading";

// Use lazy for importing your components
const Login = lazy(() => import('../components/auth/Login'));
const Register = lazy(() => import('../components/auth/Register'));
const Map = lazy(() => import('../components/home/Home'));
const MapComponent = lazy(() => import('../components/map/MapComponent'));
const Maps = lazy(() => import('../components/maps/Maps'));

const LandingPage = lazy(() => import('../components/home/Home'));
const Kontak = lazy(() => import('../components/contact/Kontak'));
const AboutUs = lazy(() => import('../components/about/AboutUs'));
const Disclaimer = lazy(() => import('../components/disclaimer/PernyataanPenafian'));
const ModulCatalog = lazy(() => import('../components/modulCatalog/ModulCatalog'));

//const InfoHotspot = lazy(() => import('../components/frame/InfoHotspot'));
 const InfoHotspot = lazy(() => import('../components/frame/hotspot/InfoHotspot'));
const InfoDevegetasi = lazy(() => import('../components/frame/InfoDevegetasi'));
const InfoFasePadi = lazy(() => import('../components/frame/InfoFasePadi'));
const InfoZPPI = lazy(() => import('../components/frame/ZPPI/InfoZPPI'));
const InfoRawanSawah = lazy(() => import('../components/frame/RawanSawah/InfoRawanSawah'));

const MapWorkspace = lazy(() => import('../components/mapWorkspace/MapWorkspace'));

const PublicRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user ? user.role : null;
    if (userRole === 'public') {
        return children;
    }
    return <Navigate to="/login" replace />;
};
function MyRouter() {
    return (
        <Routes>
            <Route path='/' element={
                <Suspense fallback={<Loading />}>
                    <LandingPage />
                </Suspense>
            } />
            <Route path='/maps' element={
                <Suspense fallback={<Loading />}>
                    <Maps />
                </Suspense>
            } />
            <Route path='/kontak' element={
                <Suspense fallback={<Loading />}>
                    <Kontak />
                </Suspense>
            } />
            <Route path='/tentang' element={
                <Suspense fallback={<Loading />}>
                    <AboutUs />
                </Suspense>
            } />
            <Route path='/penafian' element={
                <Suspense fallback={<Loading />}>
                    <Disclaimer />
                </Suspense>
            } />
            <Route path='/katalog-modul' element={
                <Suspense fallback={<Loading />}>
                    <ModulCatalog />
                </Suspense>
            } />

            <Route path='/login' element={
                <Suspense fallback={<Loading />}>
                    <Login />
                </Suspense>
            } />

              <Route path='/register' element={
                <Suspense fallback={<Loading />}>
                    <Register />
                </Suspense>
            } />

            <Route path='/map' element={
                <Suspense fallback={<Loading />}>
                    <PublicRoute>
                        <MapWorkspace />
                    </PublicRoute>
                </Suspense>
            } />

            <Route path='/info-hotspot' element={
                <Suspense fallback={<Loading />}>
                    <InfoHotspot />
                </Suspense>
            } />
            <Route path='/info-devegetasi' element={
                <Suspense fallback={<Loading />}>
                    <InfoDevegetasi />
                </Suspense>
            } />
            
            <Route path='/info-fase-padi' element={
                <Suspense fallback={<Loading />}>
                    <InfoFasePadi />
                </Suspense>
            } />

            <Route path='/info-rawan-sawah' element={
                <Suspense fallback={<Loading />}>
                    <InfoRawanSawah />
                </Suspense>
            } />

            <Route path='/info-zppi' element={
                <Suspense fallback={<Loading />}>
                    <InfoZPPI />
                </Suspense>
            } />


            
        </Routes>
    );
}

export default MyRouter;
