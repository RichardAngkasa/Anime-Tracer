/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import gif from "/public/assets/loading.gif";
import logo from "/public/assets/animetracelogo.png";

interface Content {
  anilist: number;
  filename: string;
  episode: number;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
}

export default function HomeBase() {
  const [url, setUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [data, setData] = useState<Content[]>([]);
  const [oneData, setOneData] = useState<Content>();
  const [loading, setLoading] = useState<boolean>(false);
  const [change, setChange] = useState<boolean>(false);

  const handleInputUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (url !== "") {
      fetch(`https://api.trace.moe/search?url=${encodeURIComponent(url)}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data["result"]);
          setOneData(data["result"][0]);
        });
    } else {
      alert("isi link");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleImageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!imageFile) {
      alert("select your image");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch("https://api.trace.moe/search", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handle error: failed API request
        return;
      }

      const data = await response.json();
      setData(data["result"]);
      setOneData(data["result"][0]);
      // Process the API response data
    } catch (error) {
      // Handle error: network error or other exceptions
    }
  };

  const handleContentChange = (load: Content) => {
    setOneData(load);
    change ? setChange(false) : setChange(true);
  };

  useEffect(() => {
    setLoading(false);
  }, [data]);

  return (
    <div className="max-w-[67rem] mx-auto px-4">
      <div className="grid grid-cols-3 gap-4 overflow-hidden">
        <div className="col-span-3  gap-4 mt-4">
          <div className="sticky top-4 space-y-4 ">
            <div className="grid grid-cols-7  p-4 w-full border-4 border-stroke rounded-lg gap-4 h-fit">
              <div
                className=" col-span-2  md:col-span-1 flex items-center cursor-pointer"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <img src={logo.src} alt="" />
              </div>{" "}
              <form
                onSubmit={handleUrlSubmit}
                className="col-span-5 md:col-span-3 flex gap-3 items-center"
              >
                <div className="flex items-center justify-between w-full">
                  <h1 className="hidden md:block font-bold text-stroke text-lg w-16">
                    LINK
                  </h1>
                  <input
                    type="text"
                    onChange={handleInputUrlChange}
                    value={url}
                    placeholder="Link"
                    className="bg-secondary rounded-sm h-10 font-bold px-4  w-full outline-none text-stroke"
                  />
                </div>
                <button className="font-bold text-buttoneText text-base rounded-sm bg-highlight hover:bg-highlight/90 transition-all duration-200 px-5 h-10 flex items-center">
                  submit
                </button>
              </form>
              <form
                onSubmit={handleImageSubmit}
                className="col-span-7 md:col-span-3 flex gap-3 items-center"
              >
                <div className="flex items-center justify-between w-full">
                  <h1 className="hidden md:block font-bold text-stroke text-lg w-16">
                    FILE
                  </h1>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="bg-secondary rounded-sm h-10 text-stroke px-4 w-full flex items-center"
                  />
                </div>
                <button className="font-bold text-buttoneText text-base rounded-sm bg-highlight hover:bg-highlight/90 transition-all duration-200 px-5 h-10 flex items-center">
                  submit
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-3 md:col-span-1 p-4 mb-4 w-full border-4 border-stroke rounded-lg space-y-2 h-fit md:h-1/2 gap-2 md:overflow-scroll overscroll-none">
          {loading && oneData == undefined ? (
            <div className="flex justify-center items-center">
              <img src={gif.src} alt="loading" className="w-20 h-20" />
            </div>
          ) : null}
          {data !== undefined
            ? data.map((a, i) => {
                const test = (duration: number) => {
                  var hours = Math.floor(duration / 60);
                  var minutes = Math.floor(duration % 60);
                  var seconds = Math.floor(
                    (duration - Math.floor(duration)) * 60
                  );
                  var formattedDuration =
                    ("0" + hours).slice(-2) +
                    ":" +
                    ("0" + minutes).slice(-2) +
                    ":" +
                    ("0" + seconds).slice(-2);
                  return formattedDuration;
                };
                const startTime = test(a.from);
                const endTime = test(a.to);
                return (
                  <>
                    {" "}
                    <div
                      key={i}
                      className="flex gap-4 rounded-sm flex-col"
                      onClick={() => {
                        handleContentChange(a);
                      }}
                    >
                      <div className="relative flex justify-end">
                        {" "}
                        <div className="absolute ">
                          {" "}
                          <h1 className="font-normal text-xl text-stroke bg-secondary">
                            Match {Math.round(a.similarity * 100 * 100) / 100}%
                          </h1>
                        </div>
                        {change ? (
                          oneData?.anilist === a.anilist ? (
                            <video
                              key={oneData?.anilist}
                              autoPlay
                              muted
                              loop
                              className="w-full"
                            >
                              <source src={oneData?.video} type="video/mp4" />
                            </video>
                          ) : (
                            <img
                              src={a.image}
                              alt={a.filename}
                              className="rounded-sm w-full"
                            />
                          )
                        ) : (
                          <img
                            src={a.image}
                            alt={a.filename}
                            className="rounded-sm w-full"
                          />
                        )}
                      </div>
                      <div>
                        {" "}
                        <h1 className="font-bold text-stroke">{a.filename}</h1>
                        <div className="font-normal text-stroke flex gap-2">
                          <h1>Episode {a.episode}</h1>
                          <span> | </span>
                          <h1>
                            {startTime} - {endTime}
                          </h1>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-secondary"></div>
                    </div>
                  </>
                );
              })
            : null}
        </div>
        <div className="col-span-2 p-4 border-4 h-fit border-stroke hidden md:block rounded-lg ">
          {loading && oneData == undefined ? (
            <div className="flex justify-center items-center">
              <img src={gif.src} alt="loading" className="w-32 h-32" />
            </div>
          ) : null}

          {oneData !== undefined ? (
            <div>
              <video
                key={oneData?.anilist}
                autoPlay
                muted
                loop
                className="w-full"
              >
                <source src={oneData?.video} type="video/mp4" />
              </video>
              <div className="text-lg font-bold text-black">
                {oneData?.filename}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
