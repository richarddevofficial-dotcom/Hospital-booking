import './globals.css';

export const metadata = {
  title: 'CarePlus Medical Center - Book Your Appointment',
  description: 'Book appointments with experienced medical professionals at CarePlus Medical Center.',
  keywords: 'hospital, appointment, medical, healthcare, doctor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}