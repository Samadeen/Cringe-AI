'use client';

import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from './page.module.css';
import cringeImg from '../assets/images/cringe.avif';
import { Form, Button, Spinner } from 'react-bootstrap';
import { FormEvent, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [quote, setQuote] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get('prompt')?.toString().trim();

    if (prompt) {
      try {
        setQuote('');
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch(
          `/api/cringe?prompt=` + encodeURIComponent(prompt)
        );
        const body = await response.json();
        setQuote(body.quote);
      } catch (error) {
        console.log(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
      }
    }
  };

  return (
    <main className={styles.main}>
      <h1>Cringe AI</h1>
      <h2>Powered by GPT-3</h2>
      <p>
        Enter a topic and the AI will generate a super cringy motivational quote
      </p>
      <div className={styles.container}>
        <Image
          src={cringeImg}
          alt='cringe image'
          fill
          priority
          className={styles.mainImage}
        />
      </div>
      <Form onSubmit={handleSubmit} className={styles.inputForm}>
        <Form.Group className='mb-3' controlId='prompt-input'>
          <Form.Label>Create a cringy quote about...</Form.Label>
          <Form.Control
            name='prompt'
            placeholder='e.g success, fear, potatoes'
            maxLength={100}
          />
        </Form.Group>
        <Button type='submit' className='mb-3' disabled={quoteLoading}>
          Make me cringe
        </Button>
      </Form>
      {quoteLoading && <Spinner animation='border' />}
      {quoteLoadingError && 'Something went wrong, Please try again'}
      {quote && <h5>{quote}</h5>}
    </main>
  );
}
