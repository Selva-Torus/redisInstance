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

  useEffect(() => {
    setCount([1]);
    setPost((prev)=>({
      ...prev , 
      restValues : {}
    }))
  }, [post.valueType]);

  const handleRestValueChange = (e) =>{
    const { name, value } = e.target;
    // const keyNumber = parseInt(name.match(/\d+/)[0]);
    // const isKey = name.startsWith("key");
    setPost((prevPost) => ({
      ...prevPost,
      restValues: {
        ...prevPost.restValues,
        [name]: value,
      },
    }));
  }
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Key
          </Label>
          <Input
            id="key"
            onChange={(e) => setPost({ ...post, key: e.target.value })}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Type
          </Label>
          <select
            id="valueType"
            className="col-span-3"
            value={post.valueType}
            onChange={(e) => setPost({ ...post, valueType: e.target.value })}
          >
            <option value="none">None</option>
            <option value="json">JSON</option>
            <option value="string">String</option>
            <option value="hash">Hash</option>
            <option value="list">List</option>
            <option value="set">Set</option>
            <option value="sorted-set">Sorted Set</option>
            <option value="stream">Stream</option>
            <option value="graph">Graph</option>
          </select>
        </div>

        {(post.valueType === "string" || "none") && (
          <div className="grid grid-cols-4 items-center gap-4">
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
        {["hash", "stream"].includes(
          post.valueType
        ) && (
          <div className="flex flex-col">
            <div>
              {count.map((item) => (
                <div className="flex justify-center w-[90%] gap-2 p-1" key={item}>
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
        {
          ["graph", "list", "set", "sorted-set"].includes(
            post.valueType
          ) && (
            <div className="flex flex-col">
              <div>
                {count.map((item) => (
                  <div className="flex justify-center w-[90%] gap-2 p-1" key={item}>
                   
                    <Input
                      className="w-3/4"
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
          )
        }

        <Button
          type="submit"
          onClick={(e) => {
            handlePost(post);
          }}
          className="bg-blue-500 p-2 text-white text-center"
          variant="outline"
        >
          Save changes
        </Button>
      </div>
    </>
  );
};

export default DataSettingModal;
