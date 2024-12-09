class CommonRegExp {
	public static readonly NAME_REGEXP = /^[A-Za-z]+[A-Za-z\s]{0,202}$/;
	public static readonly EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	public static readonly PHONE_REGEXP = /^\d{4,16}$/;
	public static readonly COUNTRY_CODE = /^\+\d{1,4}$/;
	public static readonly UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
	public static readonly PASSWORD_REGEX = /(?=^.{8,16}$)(?=.*\d)(?=.*[!@#$%^&*?]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
	public static readonly PHONE_CODE_REGEX = /^\+\d{1,4}$/;
	public static readonly DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
	public static readonly DATE_REGEX = /^\d{4}[-](0?[1-9]|1[0-2])[-](0?[1-9]|[1-2][0-9]|3[01])$/;
	public static readonly AADHAR_REGEX = /^\d{12}$/;
	public static readonly IMAGE_REGEX = /^image\/(jpe?g|png|gif)$/i;
	public static readonly FILE_REGEX = /^image\/(jpe?g|png)|application\/pdf$/i;
}

export { CommonRegExp };
