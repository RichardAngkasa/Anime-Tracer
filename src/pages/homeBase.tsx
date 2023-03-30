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
  console.log(loading);

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
      // Handle error: no image file selected
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
  };

  useEffect(() => {
    setLoading(false);
  }, [data]);

  console.log(oneData?.anilist);

  return (
    <div className="max-w-[67rem] mx-auto px-4">
      <div className="grid grid-cols-3 gap-4 overflow-hidden">
        <div className="col-span-3  gap-4 mt-4">
          <div className="sticky top-4 space-y-4 ">
            <div className="grid grid-cols-7  p-4 w-full border-4 border-stroke rounded-lg gap-4 h-fit">
              <img src={logo.src} alt="" />
              <form
                onSubmit={handleUrlSubmit}
                className="col-span-3 flex gap-3 items-center"
              >
                <div className="flex items-center justify-between w-full">
                  <h1 className="font-bold text-stroke text-lg w-16">LINK</h1>
                  <input
                    type="text"
                    onChange={handleInputUrlChange}
                    value={url}
                    className="bg-secondary rounded-sm h-10 font-bold px-4  w-full outline-none text-stroke"
                  />
                </div>
                <button className="font-bold text-buttoneText text-base rounded-sm bg-highlight hover:bg-highlight/90 transition-all duration-200 px-5 h-10 flex items-center">
                  submit
                </button>
              </form>
              <form
                onSubmit={handleImageSubmit}
                className="col-span-3 flex gap-3 items-center"
              >
                <div className="flex items-center justify-between w-full">
                  <h1 className="font-bold text-stroke text-lg w-16">FILE</h1>
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
        <div className="col-span-1 p-4 w-full border-4 border-stroke rounded-lg space-y-2 h-1/2 gap-2 overflow-scroll ">
          {data !== undefined
            ? data.map((a, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-secondary rounded-sm"
                  onClick={() => {
                    handleContentChange(a);
                  }}
                >
                  <img
                    src={a.image}
                    alt={a.filename}
                    className="rounded-sm w-2/4"
                  />
                  <h1 className="font-normal text-stroke">{a.filename}</h1>
                </div>
              ))
            : null}
        </div>
        <div className="col-span-2 gap-4 p-4 border-4 space-y-4 h-2/3 overflow-scroll border-stroke  rounded-lg ">
          {/* <div className="bg-secondary w-full h-96"> */}
          {loading && oneData == undefined ? (
            <div className="flex h-2/3 justify-center items-center">
              <img src={gif.src} alt="loading" className="w-32 h-32" />
            </div>
          ) : null}
          <div className="text-base text-black">{oneData?.filename}</div>

          {oneData !== undefined ? (
            <div>
              <video
                key={oneData.anilist}
                autoPlay
                muted
                loop
                className="w-full"
              >
                <source src={oneData.video} type="video/mp4" />
              </video>
            </div>
          ) : null}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
