function KnustLoginDirection() {
	return (
		<div className="bg-red-50 dark:bg-red-700 dark:bg-opacity-10 p-2 rounded-lg mt-4">
			To log into your email, go to{" "}
			<a
				className="underline text-red-500 dark:text-red-400"
				target="_blank"
				href="https://outlook.com/login"
				rel="noreferrer"
			>
				outlook.com/login
			</a>
			, enter your school email and password to access your account.
		</div>
	);
}

export { KnustLoginDirection };
