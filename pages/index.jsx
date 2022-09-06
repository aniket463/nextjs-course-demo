import { MongoClient } from "mongodb";
// import { useEffect, useState } from "react";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";
import { Fragment } from "react";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A first meetup",
//     image: "https://picsum.photos/seed/picsum/200/300",
//     address: "Some address, kolkata",
//     description: "This is first meetups",
//   },
//   {
//     id: "m2",
//     title: "A second meetup",
//     image: "https://picsum.photos/id/870/200/300?grayscale&blur=2",
//     address: "Some address, kolkata",
//     description: "This is second meetups",
//   },
//   {
//     id: "m3",
//     title: "A third meetup",
//     image: "https://picsum.photos/200/300/?blur",
//     address: "Some address, Goa",
//     description: "This is third meetups",
//   },
// ];

//Pre-rendering
//1.static site generation
//2.server side generation

function HomePage(props) {
  // const [loadedMeetups, setLoadedMeetups] = useState([]);

  // useEffect(() => {
  //   //send http request and fetch the data
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);
  // return <MeetupList meetups={loadedMeetups} />;

  return (
    <Fragment>
      <Head>
        <title>React_Next Meetups</title>
        <meta name="description" content="Browse a hug list of highly active react meetups!"/>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

//Static site generation -> here we have to run build to generate static page that will render, but the problem is when we add
//new data that will not show(Disadvantage), we need to add {revalidate: sec} this will update the static page in given sec.
export async function getStaticProps() {
  //fetch data from api
  const client = await MongoClient.connect(
    "mongodb+srv://mongo:Q5iWOMVURlIRMQ1t@cluster0.rog0svz.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  //Checking
  console.log(meetups);

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        id: meetup._id.toString(),
        title: meetup.data.title,
        image: meetup.data.image,
        address: meetup.data.address,
      })),
    },
    revalidate: 1,
  };
}

//Server side generation -> here generate the page upon each request. Use it when if you want ot access on req and
//response or data change frequently.
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   //fetch api data;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     },
//   };
// };

export default HomePage;
