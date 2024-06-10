import {
	Head,
	Heading,
	Html,
	Preview,
	Row,
	Section,
	Text,
} from "@react-email/components";

type VerificationEmailProps = {
	username: string;
	otp: string;
};

export default function VerificationEmail({
	username,
	otp,
}: VerificationEmailProps) {
	return (
		<Html
			lang="en"
			dir="ltr"
		>
			<Head>
				<title>Verification Code</title>
			</Head>
			<Preview>Here's your verification code: {otp}</Preview>
			<Section>
				<Row>
					<Heading as="h2">Hello {username},</Heading>
				</Row>
				<Row>
					<Text>
						Thank you for registering with us. Please use the following code to
						verify your account:
					</Text>
				</Row>
				<Row>
					<Text>{otp}</Text>
				</Row>
				<Row>
					<Text>
						If you didn't request this code, please ignore this email.
					</Text>
				</Row>
			</Section>
		</Html>
	);
}
