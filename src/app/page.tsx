'use client';

import { SignedIn } from "@clerk/clerk-react";
import {
    SignInButton,
    SignedOut,
  } from "@clerk/nextjs";

import { useUser } from '@clerk/nextjs';

export default function LandingComponent() {

    const { isSignedIn } = useUser();

    return (
        <div className=' bg-[#e0e7ff]'>
            <div className='overflow-clip flex flex-col relative min-h-[100vh]'>
                <div className="blur-[64px] translate-x-[-50%] w-[1102px] z-10 left-[50%] top-0 bottom-0 absolute">
                    <div className="one" />
                    <div className="two" />
                    <div className="three" />
                    <div className="four" />
                    <div className="five" />
                    <div className="six" />
                </div>

                <div className=' translate-x-[-50%] w-[1102px] z-10 left-[50%] top-0 bottom-0 absolute pointer-events-none'>
                    <div className='lineLeftOne'/>
                    <div className='lineLeftTwo'/>
                    <div className='lineRightOne'/>
                    <div className='lineRightTwo'/>
                </div>

                <header className='z-50 border-[#D1DAFF] absolute w-full border-b-[1px] top-[1.5rem] pb-[1.5rem]'>
                    <div className='min-w-[640px] pl-[1.5rem] pr-[1.5rem]'>
                        <div className='max-w-[48rem] mx-auto'>
                            <div className='z-20 bg-[#CFD4FA] px-[0.60rem] rounded-[md] justify-between items-center h-[4rem] flex relative'>
                                <div className='bg-[#F8F9FF] w-full px-[0.75rem] rounded-[0.5rem] justify-between items-center h-[3rem] flex relative'>
                                    <nav className='mx-auto'>
                                        <ul className='flex gap-[2rem]'>
                                            <li>
                                                <a href='#' className='text-[#2A3441] hover:bg-gray-500 hover:bg-opacity-15 rounded-lg py-[7px] px-3 transition-colors duration-150 font-semibold'>Updates</a>
                                            </li>
                                            <li>
                                                <a href='#' className='text-[#2A3441] hover:bg-gray-500 hover:bg-opacity-15 rounded-lg py-[7px] px-3 transition-colors duration-150 font-semibold'>FAQ</a>
                                            </li>
                                            <li>
                                                <a href='#' className='text-[#2A3441] hover:bg-gray-500 hover:bg-opacity-15 rounded-lg py-[7px] px-3 transition-colors duration-150 font-semibold'>Contact us</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="content-container">
                    <div className="text-container">
                        <h1 className='specialh1'>
                            The best file drive service you can find
                        </h1>
                        <p className=' font-semibold text-black/70 mt-3 mb-[30px]'>
                            Store, share and access all of your files from anywhere in the world with organization support. 
                        </p>
                        <SignedOut>
                            <SignInButton>
                                <button className="shimmer mt-5 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                    Get Started
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <a href="/dashboard/files" className="shimmer mt-5 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                    Go to Cloudly main page
                            </a>
                        </SignedIn>
        
                    </div>
                </section>

                <div className="border-[#D1DAFF] absolute w-full border-b-[1px] top-[400px] pb-[1.5rem]"/>
                <div className="border-[#D1DAFF] absolute w-full border-b-[1px] top-[510px] pb-[1.5rem]"/>

            </div>
        </div>
    );
};