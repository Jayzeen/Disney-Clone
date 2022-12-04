import { gql, GraphQLClient } from 'graphql-request';
import { useState } from 'react';

import Navbar from '../../components/Navbar'

export const getServerSideProps = async (pageContext) => {
  const url = process.env.ENDPOINT
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization": process.env.GRAPH_CMS_TOKEN
    }
  })
  const pageSlug = pageContext.query.slug

  const query = gql`
    query($pageSlug: String!) {
        video(where: {
          slug: $pageSlug}) 
        {
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
          }
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

  const variables = {
    pageSlug,
  }

  const data = await graphQLClient.request(query, variables)
  const video = data.video

  const accountData = await graphQLClient.request(accountQuery)
  const account = accountData.account

  return {
    props: {
      video,
      account
    }
  }


}


// Function to change video status to seen status
const changeToSeen = async (slug) => {
  await fetch('/api/changeToSeen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ slug })
  })
}



const Video = ({ video, account }) => {
  const [watching, setWatching] = useState(false)

  return (
    <>
      <Navbar account={account} />
      <div className="slug-main">
        <div className="slug-image">
          {!watching && <img className="slug-video-image"
            src={video.background.url} alt={video.title} />}
        </div>

        <div>
          {!watching && <div className="slug-info">


            <div className="slug-container">
              <div className="box">
                <span></span>
                <div className="content">
                  <h2 className="tag-names glow"><p>{video.tags.join(', ')}</p></h2>
                  <p className="slug-description">{video.description}</p>
                  <div className="slug-container-flex">
                    <div>
                      <button
                        className="custom-btn btn-13"
                        onClick={event => window.location.href = '/'
                        }
                      >
                        GO BACK
                      </button>
                    </div>
                    <div>
                      <button
                        className="custom-btn btn-13"
                        onClick={() => {
                          changeToSeen(video.slug)
                          watching ? setWatching(false) : setWatching(true)
                        }}
                      >
                        PLAY
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
          }
        </div>

        <div>
          {watching && (
            <video width="100%" controls>
              <source src={video.mp4.url} type="video/mp4" />
            </video>
          )}
        </div>

        <div className="info-footer"
          onClick={() => watching ? setWatching(false) : null}
        >

        </div>
      </div>
    </>
  )
}

export default Video