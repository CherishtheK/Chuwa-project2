import { useEffect, useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

export default function SearchInput({
  onSearch,
  placeholder = "Search by first, last, or preferred name…",
  delay = 300,
}: Props) {
  const [text, setText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(text.trim()), delay);
    return () => clearTimeout(timer);
  }, [text, delay, onSearch]);

  return (
    <Input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={placeholder}
      prefix={<SearchOutlined className="text-gray-400" />}
      allowClear
      className="w-full! sm:w-80!"
    />
  );
}
