import Head from "next/head";

interface HeadProps{
  title: string
}

export function Header({ title }: HeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="SAEV | Sistema de Avaliação Educar pra Valer"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}