import UserModel from '../features/user/user.model.js';

const basicAuthorizer = (req, res, next) => {
    // 1.Check if the Authorization header is present or empty
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send({ message: 'No Authorization details found' });
    }
    console.log(authHeader);

    // 2.Extract the Base64 encoded credentials from the header
    const base64Credentials = authHeader.replace('Basic ', '');
    console.log(base64Credentials);

    // 3.Decode the Base64 string to get the 'username:password' format
    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    console.log(decodedCredentials);
    // 4.Split the decoded string to get username and password
    const cred = decodedCredentials.split(':');

    const user = UserModel.getAll().find(u => u.email === cred[0] && u.password === cred[1]);
    
    if(user){
        next();
    }
    else{
        return res.status(401).send({ message: 'Invalid Authentication Credentials' });
    }

}

export default basicAuthorizer;  