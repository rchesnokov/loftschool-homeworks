import React, { useState } from 'react';
import * as R from 'ramda';

import agentImage from './assets/bond_approve.jpg';
import './Form.css';

const formFields = {
  firstname: {
    errors: {
      empty: 'Нужно указать имя',
      invalid: 'Имя указано не верно'
    },
    label: 'Имя',
    valid: ['james']
  },
  lastname: {
    errors: {
      empty: 'Нужно указать фамилию',
      invalid: 'Фамилия указана не верно'
    },
    label: 'Фамилия',
    valid: ['bond']
  },
  password: {
    errors: {
      empty: 'Нужно указать пароль',
      invalid: 'Пароль указан не верно'
    },
    label: 'Пароль',
    valid: ['007']
  }
};

const fieldsList = Object.keys(formFields);

/* Генерирует стейт вида
 * { firstname: '', firstnameError: '', ... }
 */
const fieldsState = fieldsList.reduce((acc, curr) => {
  acc[curr] = '';
  acc[curr + 'Error'] = '';
  return acc;
}, {});

const Form = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [fields, setFields] = useState(fieldsState);

  const handleChange = event => {
    const { name, value } = event.target;
    setFields({ ...fields, [name]: value });
    R.map(
      name => setFields(fields => ({ ...fields, [name + 'Error']: '' })),
      fieldsList
    );
  };

  const handleSubmit = event => {
    event.preventDefault();

    const validatedFields = R.pipe(
      R.clone,
      R.reduce((fields, name) => {
        const errorName =
          fields[name] === ''
            ? 'empty'
            : !formFields[name].valid.includes(fields[name])
            ? 'invalid'
            : '';

        if (errorName) {
          fields[name + 'Error'] = formFields[name].errors[errorName];
        }

        return fields;
      })
    )(fields)(fieldsList);

    setFields(validatedFields);

    const isLoginSuccess = fieldsList.reduce(
      (acc, curr) => acc && formFields[curr].valid.includes(fields[curr]),
      true
    );

    setIsLogged(isLoginSuccess);
  };

  return (
    <div className="app-container">
      {isLogged ? (
        <img src={agentImage} alt="bond approve" className="t-bond-image" />
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <h1>Введите свои данные, агент</h1>

          {fieldsList.map(name => (
            <p key={name} className="field">
              <label className="field__label">
                <span className="field-label">{formFields[name].label}</span>
              </label>

              <input
                className={`field__input field-input t-input-${name}`}
                name={name}
                type="text"
                value={fields[name]}
                onChange={handleChange}
              />

              <span className={`field__error field-error t-error-${name}`}>
                {fields[name + 'Error']}
              </span>
            </p>
          ))}

          <div className="form__buttons">
            <input
              type="submit"
              className="button t-submit"
              value="Проверить"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Form;
