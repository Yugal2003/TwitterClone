import jwt from "jsonwebtoken";

const isAuthonticateUser = async (req, res, next) => {
  try {
    // to check user is authenticated or not 
    const token = req.cookies.token;
    console.log("token =>", token);
    if (!token) {
        return res.status(401).json({
            success : false,
            message : "User Not Authenticated!"
        });
    }

    const verifyTokenInDB = await jwt.verify(token, process.env.SECRET_TOKEN);
    console.log("User_Data =>" , verifyTokenInDB);
    req.user = verifyTokenInDB.userId;
    next();
  } 
  catch (error) {
    console.log(error);  
  }
};


export default isAuthonticateUser;