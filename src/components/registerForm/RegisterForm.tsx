import Link from "next/link";
import css from "./RegisterForm.module.css";
import SocialIcon from "../Icons/SocialIcons";
import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { VisibilityButton } from "../UI/Buttons/VisibilityButton";
import { signIn } from "next-auth/react";
import { FormikHelpers } from "formik";
import axios from "axios";
import { nanoid } from "nanoid";
import { Modal } from "../UI/Modal";

interface RegisterInputs {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

const RegisterForm = () => {
  // Состояние для показа модального окна
  const [showModal, setShowModal] = useState(false);
  // состояние для показа или скрытия пароля
  const [visibilityPassword, setVisibilityPassword] = useState(true);
  // в зависимости от состояния показывается форма дли создания аккаунта или форма входа для зарегистрированного пользователя
  const [createAccount, setCreateAccount] = useState(true);
  const handlerCreateAccount = () => {
    setCreateAccount(!createAccount);
  };
  // router используется для перенаправления пользователя на страницу Collection
  const router = useRouter();

  const createNameInputs: string[] = [
    "firstname",
    "lastname",
    "email",
    "password",
  ];
  const loginNameInputs: string[] = createNameInputs.slice(-2);
  // Функция валидации формы
  const validateForm = (inputValue: RegisterInputs) => {
    const errors: Partial<RegisterInputs> = {};
    if (!inputValue.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputValue.email)
    ) {
      errors.email = "Invalid email address";
    }
    if (!inputValue.password) {
      errors.password = "Required";
    } else if (inputValue.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (createAccount) {
      if (!inputValue.firstname) {
        errors.firstname = "Required";
      }
      if (!inputValue.lastname) {
        errors.lastname = "Required";
      }
    }

    return errors;
  };
  // Функция добавления нового user в базу данных
  async function addNewUser(user: any,helpers:any) {
    try {
      const response = await axios.post("http://localhost:3000/users", user);
      if (response.status === 201) {
        console.log("Пользователь добавлен");
        setShowModal(true);
       helpers.resetForm()
      } else {
        console.error(
          "Произошла ошибка при создании пользователя. HTTP статус:",
          response.status
        );
      }
    } catch (error) {
      console.log("Произошла ошибка", error);
    }
  }
  // Функция для отправки данных

  const handleSubmit: any = async (
    values: RegisterInputs,
    formikHelpers: FormikHelpers<RegisterInputs>
  ) => {
    formikHelpers.setSubmitting(true);
    if (values.firstname && values.lastname) {
      const newUser = {
        id: nanoid(),
        role: "user",
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        wishlist: [],
        orders: [],
      };
      addNewUser(newUser,formikHelpers);

    } else {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (res && !res.error) {
        router.push("/Collection");
      } else {
        console.log(res);
      }
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="main-title text-center">
        {createAccount ? "Create Account" : "Log in"}
      </h2>
      <Formik
        className="w-[392px]"
        initialValues={
          createAccount
            ? { email: "", password: "", firstname: "", lastname: "" }
            : { email: "", password: "" }
        }
        onSubmit={handleSubmit}
        validate={validateForm}
      >
        {(formikProps) => {
          return (
            <Form>
              {createAccount
                ? createNameInputs.map((input) => (
                    <div key={input} className="relative">
                      <label htmlFor={input}></label>
                      <Field
                        type={
                          input === "password" && !visibilityPassword
                            ? "password"
                            : "text"
                        }
                        name={input}
                        placeholder={input[0].toUpperCase() + input.slice(1)}
                        className={`${css.input__for_register} ${
                          formikProps.touched[
                            input as keyof typeof formikProps.touched
                          ] &&
                          formikProps.errors[
                            input as keyof typeof formikProps.touched
                          ]
                            ? css.input__error
                            : ""
                        }`}
                      ></Field>
                      {input === "password" && (
                        <VisibilityButton
                          visibilityPassword={visibilityPassword}
                          setVisibilityPassword={setVisibilityPassword}
                        />
                      )}
                      <ErrorMessage
                        name={input}
                        component="div"
                        className={css.error__input_message}
                      ></ErrorMessage>
                    </div>
                  ))
                : loginNameInputs.map((input) => (
                    <div key={input} className="relative">
                      <label htmlFor={input}></label>
                      <Field
                        type={
                          input === "password" && !visibilityPassword
                            ? "password"
                            : "text"
                        }
                        name={input}
                        placeholder={input[0].toUpperCase() + input.slice(1)}
                        className={`${css.input__for_register} ${
                          formikProps.touched[
                            input as keyof typeof formikProps.touched
                          ] &&
                          formikProps.errors[
                            input as keyof typeof formikProps.touched
                          ]
                            ? css.input__error
                            : ""
                        }`}
                      ></Field>
                      {input === "password" && (
                        <VisibilityButton
                          visibilityPassword={visibilityPassword}
                          setVisibilityPassword={setVisibilityPassword}
                        />
                      )}
                      <ErrorMessage
                        name={input}
                        component="div"
                        className={css.error__input_message}
                      ></ErrorMessage>
                    </div>
                  ))}

              <button className="main-button mb-[1.55rem] w-full" type="submit">
                {createAccount ? "Register Now" : "Log in"}
              </button>
            </Form>
          );
        }}
      </Formik>
      <div className="flex justify-center">
        {createAccount ? (
          <div className="flex mb-[2.35rem]">
            <p className="text-[1.4rem]">Already have an account?</p>
            <button
              onClick={handlerCreateAccount}
              className="text-[1.4rem] text-[#748C70] ml-[2.4rem]"
            >
              Sign in
            </button>
          </div>
        ) : null}
      </div>
      <div>
        <p className="mb-[2.4rem]">Or</p>
      </div>
      <div className="flex justify-center mb-[2.4rem]">
        <SocialIcon />
      </div>

      {createAccount ? (
        <>
          <p className="text-[1.2rem]">
            By Clicking Register Now{"'"} You Agree To
            <Link href="#">Terms & conditions</Link> And
            <br />
            <Link href="#"> privacy policy.</Link>
          </p>
        </>
      ) : (
        <div className="flex justify-center text-[1.6rem]">
          {" "}
          <p className="mr-[0.2rem]">New to modimal?</p>
          <button
            onClick={handlerCreateAccount}
            className="text-[1.4rem] text-[#748C70]"
          >
            Create an account
          </button>
        </div>
      )}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          titleModal="Добавление пользователя"
        >
          Congratulations! Registration completed successfully
        </Modal>
      )}
    </div>
  );
};
export default RegisterForm;
