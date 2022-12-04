import { gql, GraphQLClient } from 'graphql-request'
import Section from '../components/Section'
import Navbar from '../components/Navbar'
import Franchise from '../components/franchise'
import Footer from '../components/Footer'


export const getStaticProps = async () => {
  const url = process.env.ENDPOINT
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization": process.env.GRAPH_CMS_TOKEN
    }
  })

  // Query to get all videos
  const videosQuery = gql`
  query {
    videos {
      createdAt,
      id,
      title,
      description,
      seen,
      slug,
      tags,
      thumbnail {
        url
      },
      mp4 {
        url
      },
      background {
        url
      },
    }
  }
  `

  // Query to get acount
  const accountQuery = gql`
  query {
    account(where: { id: "cl03pg5cs0jzy0cphxh3djb7h"}) {
      username
      avatar {
        url
      }
    }
  }
  `


  const data = await graphQLClient.request(videosQuery)
  const videos = data.videos

  const accountData = await graphQLClient.request(accountQuery)
  const account = accountData.account

  return {
    props: {
      videos,
      account
    }
  }

}


const Home = ({ videos, account }) => {

  // Function to get a random video
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)]
  }

  // Filtering videos by genre
  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre))
  }

  //Recommending videos based on watch history
  const unSeenVideos = (videos) => {
    return videos.filter(video => video.seen == false || video.seen == null)
  }


  return (
    // Splash image
    <>
      {/* importing navbar */}
      <Navbar account={account} />
      <div className="app">
        <div className="main-video">
          <img src={randomVideo(videos).background.url} alt={randomVideo(videos).title} />
        </div>

        <div className="video-feed">
          <Franchise />
        </div>

        <div className="section-div">
          <Section genre={'Recommendations'} videos={unSeenVideos(videos)} />
          <Section id="marvel" genre={'Action'} videos={filterVideos(videos, 'Action')} />
          <Section genre={'Sci-fi'} videos={filterVideos(videos, 'Sci-fi')} />
          <Section genre={'Adventure'} videos={filterVideos(videos, 'Adventure')} />
          <Section id="fantasy" genre={'Fantasy'} videos={filterVideos(videos, 'Fantasy')} />
          <Section id="disney" genre={'Animation'} videos={filterVideos(videos, 'Animation')} />
        </div>

        <Footer />
      </div>


    </>
  )
}

export default Home