import { PromotionType } from "@/types/fetchTypes";
import PromotionItem from "./PromotionItem";

type Props = {
  promotions: PromotionType[];
};

export default function PromotionList({ promotions }: Props) {
  // const [promotions, setPromotions] = useState([]);

  // useEffect(() => {
  //   const fetchPromotions = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/promotions/today`
  //       );
  //       setPromotions(data);
  //     } catch (error) {
  //       console.error("Error fetching :", error);
  //     }
  //   };
  //   fetchPromotions();
  // }, []);
  return (
    <div>
      {promotions?.map((promotion: PromotionType) => (
        <div key={promotion.id}>
          <PromotionItem promotion={promotion} />
        </div>
      ))}
    </div>
  );
}
