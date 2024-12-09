import { authenticator } from 'otplib';

const currentISODate = () => {
	return new Date().toISOString();
};
const maxISODate = () => {
	return <any>new Date('9999-01-01 00:00:00').toISOString();
};

const generateOTP = (otpValidityInMin: string) => {
	authenticator.options = {
		window: parseInt(otpValidityInMin)
	};
	const secret = authenticator.generateSecret(128),
		otp = authenticator.generate(secret);
	return { otp, secret };
};

export { currentISODate, maxISODate, generateOTP };
