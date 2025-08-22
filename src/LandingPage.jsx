import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils } from 'lucide-react';

function InfoModal({ title, content, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5"/>
          </button>
        </div>
        <p className="text-gray-700">{content}</p>
      </motion.div>
    </motion.div>
  );
}

const LandingPage = ({ onLoginClick, onRegisterClick }) => {
  const [infoModal, setInfoModal] = useState(null);

  const handleScroll = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };
  
  const showInfo = (title, content) => {
    setInfoModal({ title, content });
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f9fbf9] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ebf2e9] py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-[#121a0f]">
            <Utensils className="w-6 h-6" />
            <h2 className="text-xl font-semibold">FoodShare</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <button onClick={() => handleScroll('work')} type="button" className="text-[#121a0f] text-sm font-medium leading-normal hover:text-blue-600 transition-colors duration-300">About</button>
              <button onClick={() => handleScroll('success')} type="button" className="text-[#121a0f] text-sm font-medium leading-normal hover:text-blue-600 transition-colors duration-300">Success Stories</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onRegisterClick('NGO')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#54d22d] text-[#121a0f] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#121a0f] hover:text-[#ebf2e9] hover:scale-105 transition-all duration-300"
              >
                <span className="truncate">Sign Up</span>
              </button>
              <button onClick={onLoginClick}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#ebf2e9] text-[#121a0f] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#121a0f] hover:text-[#ebf2e9] hover:scale-105 transition-all duration-300"
              >
                <span className="truncate">Login</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCl1J7igUofbRdsb0uwBQTJp0Sw3JJ60MEYjNonc_vMtG4VGpBIZdVjX7ZzpX8CE6lcvu-2TZxUqjNpHY7YHP8sENMVIC7XOG41fq9jx98FCZD8pHFp0OhEc2Nh2GEh9TUiw64Y-ofAZP2u1b0xLdtzKYM9Ja4yhydiuIQCGZeCcAJ3p7qZ2q8bi6rHMq7IDIMGmPj7htscryUm_XumfW71fu1YawAZnNLx2Pw4WqOElwvJNx40zosyPuVCd4U5MKc_7693ic-1MQ")'
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1
                      className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                    >
                      Connect, Share, and Nourish
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Join FoodShare, a platform connecting NGOs with college canteens to eliminate surplus food waste and feed those in need.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-3 flex justify-center">
                    <button onClick={() => onRegisterClick('NGO')}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#54d22d] text-[#121a0f] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow hover:bg-[#121a0f] hover:text-[#ebf2e9] hover:scale-105 transition-all duration-300"
                    >
                      <span className="truncate">Sign Up as NGO</span>
                    </button>
                    <button onClick={() => onRegisterClick('Canteen')}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#ebf2e9] text-[#121a0f] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-[#121a0f] hover:text-[#ebf2e9] hover:scale-105 transition-all duration-300"
                    >
                      <span className="truncate">Sign Up as Canteen</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 id="work"
                  className="text-[#121a0f] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                >
                  How FoodShare Works
                </h1>
                <p className="text-[#121a0f] text-base font-normal leading-normal max-w-[720px]">
                  FoodShare simplifies the process of connecting NGOs with college canteens to redistribute surplus food.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d6e5d2] bg-[#f9fbf9] p-4 flex-col">
                  <div className="text-[#121a0f]" data-icon="Handshake" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M119.76,217.94A8,8,0,0,1,112,224a8.13,8.13,0,0,1-2-.24l-32-8a8,8,0,0,1-2.5-1.11l-24-16a8,8,0,1,1,8.88-13.31l22.84,15.23,30.66,7.67A8,8,0,0,1,119.76,217.94Zm132.69-96.46a15.89,15.89,0,0,1-8,9.25l-23.68,11.84-55.08,55.09a8,8,0,0,1-7.6,2.1l-64-16a8.06,8.06,0,0,1-2.71-1.25L35.86,142.87,11.58,130.73a16,16,0,0,1-7.16-21.46L29.27,59.58h0a16,16,0,0,1,21.46-7.16l22.06,11,53-15.14a8,8,0,0,1,4.4,0l53,15.14,22.06-11a16,16,0,0,1,21.46,7.16l24.85,49.69A15.9,15.9,0,0,1,252.45,121.48Zm-46.18,12.94L179.06,80H147.24L104,122c12.66,8.09,32.51,10.32,50.32-7.63a8,8,0,0,1,10.68-.61l34.41,27.57Zm-187.54-18,17.69,8.85L61.27,75.58,43.58,66.73ZM188,152.66l-27.71-22.19c-19.54,16-44.35,18.11-64.91,5a16,16,0,0,1-2.72-24.82.6.6,0,0,1,.08-.08L137.6,67.06,128,64.32,77.58,78.73,50.21,133.46l49.2,35.15,58.14,14.53Zm49.24-36.24L212.42,66.73l-17.69,8.85,24.85,49.69Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#121a0f] text-base font-bold leading-tight">Connect</h2>
                    <p className="text-[#639155] text-sm font-normal leading-normal">
                      NGOs and canteens register on the platform, providing details about their operations and surplus food availability.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d6e5d2] bg-[#f9fbf9] p-4 flex-col">
                  <div className="text-[#121a0f]" data-icon="Recycle" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#121a0f] text-base font-bold leading-tight">Share</h2>
                    <p className="text-[#639155] text-sm font-normal leading-normal">
                      Canteens post available surplus food, and NGOs can claim it for distribution to their beneficiaries.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d6e5d2] bg-[#f9fbf9] p-4 flex-col">
                  <div className="text-[#121a0f]" data-icon="Heart" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#121a0f] text-base font-bold leading-tight">Nourish</h2>
                    <p className="text-[#639155] text-sm font-normal leading-normal">Surplus food is collected and distributed, reducing waste and providing meals to those in need.</p>
                  </div>
                </div>
              </div>
            </div>
            <h2 id="success" className="text-[#121a0f] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Success Stories</h2>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4D9HEbMhZde2Pv8Fz25mT7a1GIVcYl8DtoRdFT-cRjPBw5nFuQoyTV8FzUazvo0j_rfvIvtrRHBu0d0nTZInXNYvLtW-CgbPiqxiMVIhwpbrNrOq7RGz1yogtXDoV5rX4LQKLBbpbqcAcay6wP8LZQ8Ac8HdWfxokSRVBz1IIpvHwkyfnWm1Fd7YEBUZtcG8oRCto4tBmOILhCWmpzoLSdEbrSTJwc5EdVxEUC4CTy0DVz-nKJV0ea03Xpbxi6pegVcgYC4z7GQ")' }}></div>
                  <div>
                    <p className="text-[#121a0f] text-base font-medium leading-normal">Feeding the Community</p>
                    <p className="text-[#639155] text-sm font-normal leading-normal">FoodShare has helped redistribute over 5000 meals, feeding hundreds of people in need.</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYXu4h83SrM9x6LkQUlRGoy68MGxkbtoSyvd-clOElMAroI7qjuAwz4tw-I1AGI42M1b2g--xs2OQUz1eB3nRpROIT_fP1TC3OFcCXmS2HIQrZS8NyGsRCVZzxJ_TMjUe1VLDRIJLO37lKIassdOBC-txJ4Z7u9PN1OaByCIOcAdeoMIPKIMt82kMj7_1ljj3Blky-S1aO9UuI_Omhq_aMYp9nlYK1pQIX-USZVarLh6xccVSQoDPgGDaxaYvaOb8SQHWYFXTsBg")' }}></div>
                  <div>
                    <p className="text-[#121a0f] text-base font-medium leading-normal">Reducing Food Waste</p>
                    <p className="text-[#639155] text-sm font-normal leading-normal">
                      Our platform has diverted over 2 tons of food from landfills, contributing to a more sustainable environment.
                    </p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC19RMBBLZ202wEyZ6wiSjEYM9ylUqKpCLyj3-xzSiJodljdodTmcXVOj6eE07eIDEly_CdZ68R-hq4csm-2NYHJe_GsJJDEPLfm9JIxpCONMUIyOPxUQCMasZPcbv_jtp-WoV-IrmwVTuFjac0o2TRPVR_L2IJZhBtmsPzFB9DTcMowS1CDEazB9zVDm-ODI4ItTK736rfvjCj8VRJOZ-5th807O2g2xKmtNFzE25qYGZ_B1N6KivkvhOtweeey_Fl-4LpBTewVA")' }}></div>
                  <div>
                    <p className="text-[#121a0f] text-base font-medium leading-normal">Partnership for Change</p>
                    <p className="text-[#639155] text-sm font-normal leading-normal">Canteens and NGOs are working together to create a positive impact on their communities.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="@container">
              <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                <div className="flex flex-col gap-2 text-center">
                  <h1
                    className="text-[#121a0f] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                  >
                    Ready to Make a Difference?
                  </h1>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex justify-center">
                    <button onClick={() => onRegisterClick('NGO')}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#54d22d] text-[#121a0f] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow hover:bg-[#121a0f] hover:text-[#ebf2e9] hover:scale-105 transition-all duration-300"
                    >
                      <span className="truncate">Sign Up Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="flex justify-center">
          <div className="flex max-w-6xl mx-auto flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <button onClick={() => showInfo('About Us', 'FoodShare is a platform dedicated to reducing food waste by connecting surplus food from canteens with NGOs in need.')} type="button" className="text-[#639155] text-base font-normal leading-normal min-w-40 hover:text-blue-600 transition-colors duration-300">About Us</button>
                <button onClick={() => showInfo('Contact', 'For any inquiries, please contact our support team at support@foodshare.com.')} type="button" className="text-[#639155] text-base font-normal leading-normal min-w-40 hover:text-blue-600 transition-colors duration-300">Contact</button>
                <button onClick={() => showInfo('Privacy Policy', 'Your privacy is important to us. This policy outlines how we collect, use, and protect your data.')} type="button" className="text-[#639155] text-base font-normal leading-normal min-w-40 hover:text-blue-600 transition-colors duration-300">Privacy Policy</button>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#">
                  <div className="text-[#639155]" data-icon="TwitterLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path>
                    </svg>
                  </div>
                </a>
                <a href="#">
                  <div className="text-[#639155]" data-icon="FacebookLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
                    </svg>
                  </div>
                </a>
                <a href="#">
                  <div className="text-[#639155] " data-icon="InstagramLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                    </svg>
                  </div>
                </a>
              </div>
              <p className="text-[#639155] text-base font-normal leading-normal">@2024 FoodShare. All rights reserved.</p>
            </footer>
          </div>
        </footer>
      </div>
      <AnimatePresence>
        {infoModal && (
          <InfoModal
            title={infoModal.title}
            content={infoModal.content}
            onClose={() => setInfoModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
export default LandingPage;