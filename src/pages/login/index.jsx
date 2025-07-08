import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase/client-supabase";
import {
  FormSchemaLogin,
  getErrors,
  getFieldError,
} from "../../lib/validationForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const { error, data } = FormSchemaLogin.safeParse(formState);
    if (error) {
      const errors = getErrors(error);
      setFormErrors(errors);
      console.log(errors);
    } else {
      let { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      if (error) {
        alert("Signing in error!");
      } else {
        alert("Signed In!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/");
      }
    }
  };

  const onBlur = (property) => () => {
    const message = getFieldError(FormSchemaLogin, property, formState[property]);
    setFormErrors((prev) => ({ ...prev, [property]: message }));
    setTouchedFields((prev) => ({ ...prev, [property]: true }));
  };

  const isInvalid = (property) => {
    if (formSubmitted || touchedFields[property]) {
      return !!formErrors[property];
    }
    return undefined;
  };

  const setField = (property, valueSelector) => (e) => {
    setFormState((prev) => ({
      ...prev,
      [property]: valueSelector ? valueSelector(e) : e.target.value,
    }));
  };

  return (
    <div className="page-wrapper-cyber">
      <div className="form-container-cyber">
        <form onSubmit={onSubmit} noValidate className="form-cyber">
          <h2 className="form-title-cyber">Accedi</h2>

          <label htmlFor="email">Email:</label>
          <input
            className="input-cyber"
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={setField("email")}
            onBlur={onBlur("email")}
            aria-invalid={isInvalid("email")}
            required
          />
          {formErrors.email && (
            <small className="error-cyber">{formErrors.email}</small>
          )}

          <label htmlFor="password">Password:</label>
          <input
            className="input-cyber"
            type="password"
            id="password"
            name="password"
            value={formState.password}
            onChange={setField("password")}
            onBlur={onBlur("password")}
            aria-invalid={isInvalid("password")}
            required
          />
          {formErrors.password && (
            <small className="error-cyber">{formErrors.password}</small>
          )}

          <button type="submit" className="btn-accent mt-3">
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}
