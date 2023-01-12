import { GetStaticProps, NextPage } from 'next';

interface HomePageProps {
  data: string;
}

const IndexPage: NextPage = ({ data }: HomePageProps) => {
  return (
    <h1>{data}</h1>
  );
};

export const getStaticProps: GetStaticProps = async (_context) => {
  const response = await fetch(process.env.SERVER_HOST + '/test');
  const data = await response.text();

  return {
    props: { data },
    revalidate: 100,
  };
};

export default IndexPage;