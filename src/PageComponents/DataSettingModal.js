import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";

const DataSettingModal = ({ post, setPost, handlePost }) => {
  const [count, setCount] = useState([1]);
  const handleClick = () => {
    const arr = [...count];
    const max = count[count.length - 1] + 1;
    arr.push(max);
    setCount(arr);
  };

  const options = [
    { value: "none", label: "None" },
    { value: "json", label: "Json" },
    { value: "string", label: "String" },
    { value: "hash", label: "Hash" },
    { value: "list", label: "List" },
    { value: "set", label: "Set" },
    { value: "sorted-set", label: "Sorted Set" },
    { value: "stream", label: "Stream" },
  ];
  useEffect(() => {
    setCount([1]);
    setPost((prev) => ({
      ...prev,
      restValues: {},
    }));
  }, [post.valueType]);

  const handleRestValueChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      restValues: {
        ...prevPost.restValues,
        [name]: value,
      },
    }));
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 py-2">
        <div className="flex gap-2">
        <div className="  ">
          <Label htmlFor="name" className="text-right">
            Key
          </Label>
          <Input
            id="key"
            onChange={(e) => setPost({ ...post, key: e.target.value })}
            className="col-span-3"
          />
        </div>

        <div className="">
          <Label htmlFor="name" className="text-right">
            Type
          </Label>
          <select
            id="valueType"
            className="border-none w-full h-10"
            value={post.valueType}
            onChange={(e) => setPost({ ...post, valueType: e.target.value })}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        </div>

        {post.valueType === "string" && (
          <div className="">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <Input
              id="value"
              onChange={(e) => setPost({ ...post, value: e.target.value })}
              className="col-span-3"
            />
          </div>
        )}
        {post.valueType === "json" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jsonContent" className="text-right">
              JSON Content
            </Label>
            <Textarea
              id="jsonContent"
              onChange={(e) =>
                setPost({ ...post, jsonContent: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        )}
        {["hash", "stream"].includes(post.valueType) && (
          <div className="flex flex-col">
            <div>
              {count.map((item) => (
                <div
                  className="flex justify-center w-[90%] gap-2 p-1"
                  key={item}
                >
                  <Input
                    className="w-1/2"
                    type="text"
                    name={`key${item}`}
                    onChange={handleRestValueChange}
                    placeholder={`Enter value for key${item}`}
                  />
                  <Input
                    className="w-1/2"
                    type="text"
                    name={`value${item}`}
                    onChange={handleRestValueChange}
                    placeholder={`Enter value for value${item}`}
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleClick}> Add Column </Button>
          </div>
        )}
        {["graph", "list", "set", "sorted-set"].includes(post.valueType) && (
          <div className="flex flex-col">
            <div>
              {count.map((item) => (
                <div
                  className="flex justify-center w-[90%] gap-2 p-1"
                  key={item}
                >
                  <Input
                    // className="w-3/4"
                    type="text"
                    name={`value${item}`}
                    onChange={handleRestValueChange}
                    placeholder={`Enter value for value${item}`}
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleClick}> Add Column </Button>
          </div>
        )}

        <Button
          type="submit"
          onClick={(e) => {
            if(post.key && post.valueType){
              handlePost(post);
            }
          }}
          className="bg-blue-500 p-2 text-white flex justify-center items-center "
          variant="outline"
        >
          Save changes
        </Button>
      </div>
    </>
  );
};

export default DataSettingModal;
