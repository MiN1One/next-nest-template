import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface HomePageProps {
  data: string;
}

const IndexPage: NextPage = ({ data }: HomePageProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{data}</h1>
      <h2>Server translated content: {t('hello')}</h2>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (ctx) => {
  const locale = ctx.locale || ctx.defaultLocale;
  
  const [data, translations] = await Promise.all([
    fetch(process.env.SERVER_HOST + '/test')
      .then(r => r.text()),
    serverSideTranslations(locale)
  ]);

  return {
    props: {
      data,
      ...translations
    },
    revalidate: 100,
  };
};

export default IndexPage;