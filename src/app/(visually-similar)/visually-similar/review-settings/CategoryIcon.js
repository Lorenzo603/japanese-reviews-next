import Image from "next/image";

export const CategoryIcon = (props) => {
    return (
        <Image src={props.url} alt=""
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
        />
    )
}
export default CategoryIcon;