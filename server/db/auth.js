const client = require('./client');
const { v4 } = require('uuid');
const uuidv4 = v4;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const findUserByToken = async(token) => {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const SQL = `
      SELECT id, username, email, is_admin
      FROM users
      WHERE id = $1
    `;
    const response = await client.query(SQL, [payload.id]);
    if(!response.rows.length){
      const error = Error('bad credentials');
      error.status = 401;
      throw error;
    }

    return response.rows[0];
  }
  catch(ex){
    console.log(ex);
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
}

const authenticate = async(credentials)=> {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [credentials.username]);
  if(!response.rows.length){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  const valid = await bcrypt.compare(credentials.password, response.rows[0].password);
  if(!valid){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }

  return jwt.sign({ id: response.rows[0].id }, process.env.JWT);
};

const createUser = async(user)=> {
  if(!user.username.trim() || !user.email.trim() || !user.password.trim()){
    throw Error('must have username, email, and password');
  }
  user.password = await bcrypt.hash(user.password, 5);
  const SQL = `
    INSERT INTO users (id, username, email, password, is_admin) 
    VALUES($1, $2, $3, $4, $5) 
    RETURNING *
  `;
  const response = await client.query(SQL, [ uuidv4(), user.username, user.email, user.password, user.is_admin || false ]);
  return response.rows[0];
};

const updateProfile = async(userId, newData)=> {  
  const SQL = `
    UPDATE users
    SET username = $1, email = $2
    WHERE id = $3
    RETURNING *
  `;
  const response = await client.query(SQL, [ newData.username, newData.email, userId ]);
  return response.rows[0];
};

const updatePassword = async(userId, newPassword)=> {
  const hashedPassword = await bcrypt.hash(newPassword, 5);
  
  const SQL = `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING *
  `;
  const response = await client.query(SQL, [ hashedPassword, userId ]);
  return response.rows[0];
};

module.exports = {
  createUser,
  authenticate,
  findUserByToken,
  updateProfile,
  updatePassword
};
