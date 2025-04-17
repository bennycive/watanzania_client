'use client'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import img from '../../assets/Images/Login.jpg'
import logo from '../../assets/Images/newsLogo/lightMode/header-logo.svg'
import Image from "next/image";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from './ForgotPasswordForm'
import { BiUserCircle } from 'react-icons/bi'
import PhoneLogin from './PhoneLogin'
import {  placeholderImage, translate } from '@/utils/helpers'
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from 'react-redux'
import { checkIsLoginModalOpen } from '../store/reducers/helperReducer'

export default function LoginModal({ onClose = () => { } }) {

  const [mainModal, setMainModal] = useState(false);
  const [loginModal, setLoginModal] = useState(true)
  const [registerModal, setRegisterModal] = useState(false)
  const [phoneLogin, setPhoneLogin] = useState(false)
  const [forgotPassModal, setForgotPassModal] = useState(false)

  const [islogout, setIsLogout] = useState(false);

  const isLoginModalOpen = useSelector(checkIsLoginModalOpen)

  const handleOpenLoginModal = () => {
    onClose()
    setLoginModal(true)
    setRegisterModal(false)
    setForgotPassModal(false)
    setPhoneLogin(false)
  }

  useEffect(() => {
    if(isLoginModalOpen) {
      setMainModal(true)
    }
  }, [isLoginModalOpen])
  

  return (
    <Dialog open={mainModal} onOpenChange={setMainModal}>
      <DialogTrigger asChild>
        <button className='commonBtn flexCenter gap-2' onClick={handleOpenLoginModal}><BiUserCircle size={23} />{translate('loginLbl')}</button>
      </DialogTrigger>

      <DialogContent className="loginModal bodyBgColor !h-max !w-[300px] sm:!w-max lg:max-w-[60%] xl:!h-[41rem] p-0 overflow-hidden">
        <span className='absolute top-4 ltr:right-4 rtl:left-4 cursor-pointer' onClick={() => setMainModal(false)}><MdOutlineClose size={30} color='gray' /></span>
        <div className="grid grid-cols-1 xl:grid-cols-2">

          {/* Left Image Section */}
          <div className="hidden xl:block relative after:content-[''] overflow-hidden after:absolute after:top-0 after:left-0 after:h-full after:w-full after:bg-[#0003]">
            <Image src={logo} height={0} width={0} alt="logo" className="h-auto w-[180px] absolute top-8 left-8 object-cover z-[1]" onError={placeholderImage} loading='lazy'/>
            <Image src={img} height={0} width={0} alt="login-img" className="h-full w-full object-cover commonRadius" onError={placeholderImage} loading='lazy'/>
          </div>
          {
            loginModal &&
            <LoginForm setRegisterModal={setRegisterModal} setPhoneLogin={setPhoneLogin} setLoginModal={setLoginModal} setForgotPassModal={setForgotPassModal} setIsLogout={setIsLogout}
              setMainModal={setMainModal} />
          }

          {
            registerModal &&
            <RegisterForm setLoginModal={setLoginModal} setRegisterModal={setRegisterModal} />
          }

          {
            forgotPassModal &&
            <ForgotPasswordForm setForgotPassModal={setForgotPassModal} setLoginModal={setLoginModal} />
          }

          {
            phoneLogin &&
            <PhoneLogin setMainModal={setMainModal} />
          }

        </div>


      </DialogContent >
    </Dialog >
  );
}
