export const createToken = (userId, userType, fullName, userData) => {
  const tokenData = {
    userId,
    userType,
    fullName
  };

  // Add user type specific data
  if (userType === 'student') {
    tokenData.studentType = userData.studentType;
    tokenData.rollNumber = userData.rollNumber;
    tokenData.class = userData.class;
    tokenData.stream = userData.stream;
    tokenData.year = userData.year;
  } else if (userType === 'teacher') {
    tokenData.subject = userData.subject;
    tokenData.qualification = userData.qualification;
  }

  return jwt.sign(tokenData, JWT_SECRET, { expiresIn: '24h' });
};

export const setTokenCookie = (res, token) => {
  res.setHeader('Set-Cookie', `authToken=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`);
};