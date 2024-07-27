import {useEffect, useState} from 'react'
import './App.css'

const podcastURLs = [
  "https://feeds.buzzsprout.com/1497970.rss",
  "https://feeds.simplecast.com/5nKJV82u"
]
//const podcastURL = 
// const podcastURL = "https://www.relay.fm/cortex/feed"
const podcastURL = podcastURLs[0]
type ImageURL = string;
type AudioURL = string;

function App() {
  return (
    <PodcastInfo />
  )
}

interface Podcast {
  name: string,
  thumbnailUrl: ImageURL
  episodes: Episode[]
}

interface Episode {
  name: string,
  description: string,
  audioUrl: AudioURL,
  thumbnailUrl?: ImageURL
}

function parsePodcast(doc : XMLDocument) : Podcast {
    console.log(doc)
    const el = doc.querySelector("rss>channel>title") as Element
    const name = el.innerHTML
    const thumbnailUrl = doc.querySelector("rss>channel>image>url")?.innerHTML || ""
    const episodes : Episode[] = Array.from(doc.querySelectorAll("rss>channel>item").values())
      .map((el: Element) : Episode => {
        return {
          name: el.querySelector("title")?.innerHTML || '',
          audioUrl: el.querySelector("enclosure")?.getAttribute("url") || "",
          description: el.querySelector("summary")?.innerHTML || '',
          thumbnailUrl: el.querySelector("image")?.getAttribute("href") || ''
        }
      }).slice(0, 10)
    return {name, thumbnailUrl, episodes}
  }


  function PodcastInfo() {
    const [podcast, setPodcast] = useState<Podcast | null>(null)
    const [err, setErr] = useState<Error | null>(null)
    async function getPodcast() : Promise<Podcast> {
      return fetch(podcastURL)
        .then(response => response.text())
        .then(content => {
          const parser = new DOMParser()
          return parser.parseFromString(content, "application/xml")
        })
        .then(parsePodcast)
    }

    useEffect(() => {
      (async () => {
        try {
          setPodcast(await getPodcast())
        } catch (e) {
          if (e instanceof Error) {
            setErr(e)
          }
        }
      })()
    }, [])

    if (err) {
      console.error(err)
      return <>Couldn't Fetch Data</>
    }
    
    if (!podcast) {
      return <>Loading...</>
    }
    console.log(podcast)
    return (<>
      <img className="podcastThumbnail" src={podcast.thumbnailUrl} /> 
      <h1>{podcast.name}</h1>
      <div>{podcast.episodes.map((episode) => <PodcastEpisode episode={episode} />)}</div>
    </>)
  }

  function PodcastEpisode({episode} : {episode: Episode}) {
    return (
      <article>
        {episode.thumbnailUrl && (
          <div><img className="podcastThumbnail" src={episode.thumbnailUrl}/></div>
      )}
      <h3>{episode.name}</h3>
      <div>{episode.description}</div>
      <div><audio controls src={episode.audioUrl}/></div>
    </article>
  )

}

export default App
