import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as https from 'https';

@Injectable()
export class RecipeCrawlerService {
  private baseUrl = 'https://monngonmoingay.com';
  // Cấu hình axios bỏ qua lỗi SSL nếu cần
  private axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  /**
   * Lấy toàn bộ dữ liệu từ 196 trang
   */
  async getAllRecipes(): Promise<any[]> {
    const totalPages = 196;
    const allRecipes = [];

    // Duyệt qua tất cả các trang
    for (let page = 1; page <= totalPages; page++) {
      let pageUrl = '';
      if (page === 1) {
        pageUrl = `${this.baseUrl}/tim-kiem-mon-ngon/`;
      } else {
        pageUrl = `${this.baseUrl}/tim-kiem-mon-ngon/page/${page}/`;
      }

      try {
        console.log(`Fetching page ${page}: ${pageUrl}`);
        const { data } = await this.axiosInstance.get(pageUrl);
        const $ = cheerio.load(data);

        // Giả sử mỗi khối món ăn nằm trong container có class "container recipe-filter-form"
        // và bên trong có các khối "flex-recipe bg-white"
        $('.container.recipe-filter-form .flex-recipe.bg-white').each(
          (_, element) => {
            // Lấy link và ảnh từ khối div.relative chứa <a>
            const mainAnchor = $(element).find('div.relative a').first();
            const recipeUrl = mainAnchor.attr('href')?.trim() || '';
            let image = mainAnchor.find('img').attr('src') || '';
            if (!image) {
              const srcset = mainAnchor.find('img').attr('srcset');
              if (srcset) {
                image = srcset.split(' ')[0];
              }
            }

            // Lấy tiêu đề từ thẻ h3 chứa <a>
            const title = $(element).find('h3 a').text().trim();

            // Lấy thông tin phụ: số người, thời gian, độ khó
            let people = '',
              difficulty = '',
              time = '';
            $(element)
              .find('.tags .tag')
              .each((i, tagElem) => {
                const tagText = $(tagElem).text().trim();
                if (tagText.includes('Người')) {
                  people = tagText;
                } else if (tagText.includes('Phút')) {
                  time = tagText;
                } else if (tagText.length <= 3) {
                  // Ví dụ: "Dễ"
                  difficulty = tagText;
                }
              });

            // Lấy số vote (nếu có)
            const votes = $(element)
              .find('.tag.tag-small span')
              .first()
              .text()
              .trim();

            if (title && recipeUrl) {
              allRecipes.push({
                title,
                url: recipeUrl,
                image,
                people,
                difficulty,
                time,
                votes,
              });
            }
          },
        );
      } catch (error) {
        console.error(`❌ Lỗi khi lấy trang ${page}:`, error);
      }
    }
    return allRecipes;
  }

  chunkArray<T>(array: T[], chunkSize: number): T[][] {
    if (chunkSize <= 0) throw new Error("chunkSize phải lớn hơn 0");
  
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async crawlRecipes(): Promise<any[]> {
    const recipes =     [
      {
          "title": "Dồi trường xào cải chua",
          "url": "https://monngonmoingay.com/doi-truong-xao-cai-chua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8444_DoiTruongXaoCai.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "15"
      },
      {
          "title": "Canh bầu nấu riêu tép",
          "url": "https://monngonmoingay.com/canh-bau-nau-rieu-tep/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_4661-canh-bau-nau-rieu-tep.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "3"
      },
      {
          "title": "Salad chip chip",
          "url": "https://monngonmoingay.com/salad-chip-chip/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8464_SaladChip.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "3"
      },
      {
          "title": "Bê thấu",
          "url": "https://monngonmoingay.com/be-thau/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/be-thau-540.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "3"
      },
      {
          "title": "Bò cuộn ba rọi xông khói",
          "url": "https://monngonmoingay.com/bo-cuon-ba-roi-xong-khoi-chien/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/BÒ-CUỘN-BA-RỌI-XÔNG-KHÓI_CQC1552.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "4"
      },
      {
          "title": "Cá thu nhật kho me",
          "url": "https://monngonmoingay.com/ca-thu-nhat-kho-me/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8500_CaThuNhatKhoMe.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "9"
      },
      {
          "title": "Gà hấp đậu hũ non",
          "url": "https://monngonmoingay.com/ga-hap-dau-hu-non/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/ga-hap-dau-hu-non-40an466.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "9"
      },
      {
          "title": "Củ hũ dừa kho nấm",
          "url": "https://monngonmoingay.com/cu-hu-dua-kho-nam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_3993_cu-hu-dua-kho-nam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "7"
      },
      {
          "title": "Lẩu cá thác lác khổ qua",
          "url": "https://monngonmoingay.com/lau-ca-thac-lac-kho-qua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8369_LauCaThacLac.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "13"
      },
      {
          "title": "Gỏi chân gà tôm chua",
          "url": "https://monngonmoingay.com/goi-chan-ga-tom-chua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8298_GoiChanGaTomChua.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "4"
      },
      {
          "title": "Chả giò cá",
          "url": "https://monngonmoingay.com/cha-gio-ca/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8424_ChaGioCa.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "7"
      },
      {
          "title": "Canh cá thác lác nấu hoa",
          "url": "https://monngonmoingay.com/canh-ca-thac-lac-nau-hoa/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0765-canh-ca-thac-lac-nau-hoa.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "2"
      },
      {
          "title": "Salad măng cụt",
          "url": "https://monngonmoingay.com/salad-mang-cut/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8285_SaladMangCut.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "5"
      },
      {
          "title": "Thịt heo quay kho củ hũ dừa",
          "url": "https://monngonmoingay.com/thit-heo-quay-kho-cu-hu-dua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8387_ThitHeoQuayKho.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "10"
      },
      {
          "title": "Bao tử xào đông cô",
          "url": "https://monngonmoingay.com/bao-tu-xao-dong-co/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0081-bao-tu-xao-dong-co.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "5"
      },
      {
          "title": "Canh khế cá cơm",
          "url": "https://monngonmoingay.com/canh-khe-ca-com/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0491-canh-khe-ca-com.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "4"
      },
      {
          "title": "Bánh khoai mì trứng cút",
          "url": "https://monngonmoingay.com/banh-khoai-mi-trung-cut/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8250_KhoaiMiTrungCut.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "6"
      },
      {
          "title": "Lòng heo xào thơm",
          "url": "https://monngonmoingay.com/long-heo-xao-thom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201412190105380000005_monngonmoingay.com-long-heo-xao-thom-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "9"
      },
      {
          "title": "Đông cô hấp tôm",
          "url": "https://monngonmoingay.com/dong-co-hap-tom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0436-dong-co-hap-tom.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "8"
      },
      {
          "title": "Đậu hũ hấp tôm",
          "url": "https://monngonmoingay.com/dau-hu-hap-tom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0033-dau-hu-hap-tom.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "10"
      },
      {
          "title": "Salad dưa leo thịt gà",
          "url": "https://monngonmoingay.com/salad-dua-leo-thit-ga/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7860_DualeoThitGa.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "7"
      },
      {
          "title": "Tàu hủ ky cuộn mực chiên",
          "url": "https://monngonmoingay.com/tau-hu-ky-cuon-muc-chien/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7762_tauhukiMUC.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "10"
      },
      {
          "title": "Mực nhúng giấm",
          "url": "https://monngonmoingay.com/muc-nhung-giam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0060-muc-nhung-giam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "7"
      },
      {
          "title": "Vịt nấu sake",
          "url": "https://monngonmoingay.com/vit-nau-sake/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7890_vitSake.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "4"
      },
      {
          "title": "Canh riêu cua",
          "url": "https://monngonmoingay.com/canh-rieu-cua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0590-canh-rieu-cua.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "7"
      },
      {
          "title": "Bánh ướt xào hải sản",
          "url": "https://monngonmoingay.com/banh-uot-xao-hai-san/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7722-banh-uot-xao-hai-san.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "113"
      },
      {
          "title": "Thịt ba chỉ nướng trái cây",
          "url": "https://monngonmoingay.com/thit-ba-chi-nuong-trai-cay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0263-thit-ba-chi-nuong-trai-cay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "4"
      },
      {
          "title": "Gỏi thanh long",
          "url": "https://monngonmoingay.com/goi-thanh-long/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0321-goi-thanh-long.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "7"
      },
      {
          "title": "Gà nướng táo",
          "url": "https://monngonmoingay.com/ga-nuong-tao-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/9090-ga-nuong-tao.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "4"
      },
      {
          "title": "Thịt gà kho kim chi",
          "url": "https://monngonmoingay.com/thit-ga-kho-kim-chi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/THỊT-GÀ-KHO-KIM-CHI_CQC1391.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "19"
      },
      {
          "title": "Gà chiên lạp xưởng",
          "url": "https://monngonmoingay.com/ga-chien-lap-xuong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/GÀ-CHIÊN-LẠP-XƯỞNG_CQC1387.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "2"
      },
      {
          "title": "Gỏi dưa leo khô cá",
          "url": "https://monngonmoingay.com/goi-dua-leo-kho-ca/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1524-goi-dua-leo-kho-ca.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "5"
      },
      {
          "title": "Gỏi bông thiên lý chay",
          "url": "https://monngonmoingay.com/goi-bong-thien-ly-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1468-goi-bong-thien-ly-chay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "6"
      },
      {
          "title": "Gà chiên bơ",
          "url": "https://monngonmoingay.com/ga-chien-bo/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7648-ga-chien-bo.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "18"
      },
      {
          "title": "Bánh rán nhân cua",
          "url": "https://monngonmoingay.com/banh-ran-nhan-cua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/88.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "60 Phút",
          "votes": "1"
      },
      {
          "title": "Bánh mì nướng xốt cà",
          "url": "https://monngonmoingay.com/banh-mi-nuong-xot-ca/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/76.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "45 Phút",
          "votes": "3"
      },
      {
          "title": "Mì gói xào bò",
          "url": "https://monngonmoingay.com/mi-goi-xao-bo/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7664-mi-goi-xao-bo.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "21"
      },
      {
          "title": "Miến măng gà",
          "url": "https://monngonmoingay.com/mien-mang-ga/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1423_1-mien-mang-ga.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "60 Phút",
          "votes": "14"
      },
      {
          "title": "Chân giò ninh măng lưỡi lợn",
          "url": "https://monngonmoingay.com/chan-gio-ninh-mang-luoi-lon/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1453-chan-gio-ninh-mang-luoi-lon.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "45 Phút",
          "votes": "4"
      },
      {
          "title": "Canh bắp cải gói thịt",
          "url": "https://monngonmoingay.com/canh-bap-cai-goi-thit/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1355-canh-bap-cai-goi-thit.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "26"
      },
      {
          "title": "Gân bò ngâm chua ngọt",
          "url": "https://monngonmoingay.com/gan-bo-ngam-chua-ngot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1668-gan-bo-ngam-chua-ngot.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "140 Phút",
          "votes": "3"
      },
      {
          "title": "Bò nướng sa tế",
          "url": "https://monngonmoingay.com/bo-nuong-sa-te/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7728-bo-nuong-sa-te.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "35 Phút",
          "votes": "14"
      },
      {
          "title": "Tôm xào bông cải",
          "url": "https://monngonmoingay.com/tom-xao-bong-cai/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1286-tom-xao-bong-cai.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "21"
      },
      {
          "title": "Lẩu chem chép tía tô",
          "url": "https://monngonmoingay.com/lau-chem-chep-tia-to/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7611-lau-chem-chep-tia-to.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "3"
      },
      {
          "title": "Gỏi đu đủ ba khía",
          "url": "https://monngonmoingay.com/goi-du-du-ba-khia/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7835-goi-du-du-ba-khia.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "2"
      },
      {
          "title": "Cá nướng chấm muối ớt xanh",
          "url": "https://monngonmoingay.com/ca-nuong-cham-muoi-ot-xanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CaNuongChamMuoiOtXanh_CQC9548.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "21"
      },
      {
          "title": "Canh ốc thì là",
          "url": "https://monngonmoingay.com/canh-oc-thi-la/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7689-canh-oc-thi-la.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "4"
      },
      {
          "title": "Canh cải chua nấu cá cơm",
          "url": "https://monngonmoingay.com/canh-cai-chua-nau-ca-com/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/12_CQC9656-canh-cai-chua-nau-ca-com.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "7"
      },
      {
          "title": "Cá tai tượng hấp",
          "url": "https://monngonmoingay.com/ca-tai-tuong-hap/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7876_ca-Taituong.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "35 Phút",
          "votes": "4"
      },
      {
          "title": "Cá chiên hoa cúc",
          "url": "https://monngonmoingay.com/ca-chien-hoa-cuc/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1240_1-ca-chien-hoa-cuc.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "2"
      },
      {
          "title": "Canh boaro nấu đậu hũ non",
          "url": "https://monngonmoingay.com/canh-boaro-nau-dau-hu-non/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201311011114130000004_monngonmoingay.com-canh-baoro-nau-dau-hu-non-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "8"
      },
      {
          "title": "Hến xào mít",
          "url": "https://monngonmoingay.com/hen-xao-mit/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7633_hen.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "3"
      },
      {
          "title": "Cá basa chiên giòn vị chanh",
          "url": "https://monngonmoingay.com/ca-basa-chien-gion-vi-chanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/10_CQC1391-ca-ba-sa-chien-gion-vi-chanh.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "19"
      },
      {
          "title": "Thịt heo ngâm nước mắm",
          "url": "https://monngonmoingay.com/thit-heo-ngam-nuoc-mam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1365-thit-heo-ngam-nuoc-mam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "45 Phút",
          "votes": "14"
      },
      {
          "title": "Chân gà chiên chấm mắm mè",
          "url": "https://monngonmoingay.com/chan-ga-chien-cham-mam-me/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7748_changa.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "10"
      },
      {
          "title": "Dưa món",
          "url": "https://monngonmoingay.com/dua-mon/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1620-dua-mon.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "35 Phút",
          "votes": "4"
      },
      {
          "title": "Chả tôm nhân phô mai",
          "url": "https://monngonmoingay.com/cha-tom-nhan-pho-mai/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7590_chatom.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "9"
      },
      {
          "title": "Gà cuộn khoai chiên giòn",
          "url": "https://monngonmoingay.com/ga-cuon-khoai-chien-gion/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/9_CQC1355-ga-cuon-khoai-chien-gion.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "15"
      },
      {
          "title": "Cà chua nhồi thịt ghẹ",
          "url": "https://monngonmoingay.com/ca-chua-nhoi-thit-ghe/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7796_cachua.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "7"
      },
      {
          "title": "Rau tiến vua ngâm chua",
          "url": "https://monngonmoingay.com/rau-tien-vua-ngam-chua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-2315-rau-tien-vua-ngam-chua.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "0"
      },
      {
          "title": "Ba rọi kho gừng",
          "url": "https://monngonmoingay.com/ba-roi-kho-gung/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/8_CQC1305-ba-roi-kho-gung.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "31"
      },
      {
          "title": "Đọt su xào tôm",
          "url": "https://monngonmoingay.com/dot-su-xao-tom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC7817_-dot-su-xao-tom.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "11"
      },
      {
          "title": "Vịt nấu măng",
          "url": "https://monngonmoingay.com/vit-nau-mang/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1645-vit-nau-mang.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "13"
      },
      {
          "title": "Lẩu cá đuối lá giang",
          "url": "https://monngonmoingay.com/lau-ca-duoi-la-giang-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC6700_lau-caduoi.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "11"
      },
      {
          "title": "Rau muống ngâm chua",
          "url": "https://monngonmoingay.com/rau-muong-ngam-chua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-2214-rau-muong-ngam-chua.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "6"
      },
      {
          "title": "Thịt chiên xốt nước tương",
          "url": "https://monngonmoingay.com/thit-chien-xot-nuoc-tuong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/6_CQC9610-thit-chien-xot-nuoc-tuong.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "30"
      },
      {
          "title": "Tai heo ngâm giấm",
          "url": "https://monngonmoingay.com/tai-heo-ngam-giam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1511_1-tai-heo-ngam-giam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "10"
      },
      {
          "title": "Thịt cuốn rau củ",
          "url": "https://monngonmoingay.com/thit-cuon-rau-cu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1117-thit-cuon-rau-cu.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "8"
      },
      {
          "title": "Gỏi xoài khô cá sặc",
          "url": "https://monngonmoingay.com/goi-xoai-kho-ca-sac/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/4_CQC1338-goi-xoai-kho-ca-sac.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "11"
      },
      {
          "title": "Thịt quay kho dưa cải",
          "url": "https://monngonmoingay.com/thit-quay-kho-dua-cai/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/Thit-quay-kho-dua-cai1.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "24"
      },
      {
          "title": "Cá chiên ngâm nước tương",
          "url": "https://monngonmoingay.com/ca-chien-ngam-nuoc-tuong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1082-ca-chien-ngam-nuoc-tuong.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "10"
      },
      {
          "title": "Nem chay vỏ bưởi",
          "url": "https://monngonmoingay.com/nem-chay-vo-buoi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/3_CQC1410-nem-chay-vo-buoi.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "3"
      },
      {
          "title": "Gỏi cá hấp kiểu Nhật",
          "url": "https://monngonmoingay.com/goi-ca-hap-kieu-nhat/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_2445-goi-ca-hap-kieu-nhat.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "2"
      },
      {
          "title": "Salad đậu cô ve",
          "url": "https://monngonmoingay.com/salad-dau-co-ve/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/212.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "3"
      },
      {
          "title": "Canh chua cá lăng rau nhút",
          "url": "https://monngonmoingay.com/canh-chua-ca-lang-rau-nhut/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/2_CQC1443-canh-chua-ca-lang-rau-nhut.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "5"
      },
      {
          "title": "Bún bò Huế Chay",
          "url": "https://monngonmoingay.com/bun-bo-hue/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/5_CQC9676-bun-bo-hue-chay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "4"
      },
      {
          "title": "Cuốn lá lốt chay",
          "url": "https://monngonmoingay.com/cuon-la-lot-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC5699_CuonLaLotChay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "8"
      },
      {
          "title": "Nấm bào ngư xào xốt mè",
          "url": "https://monngonmoingay.com/nam-bao-ngu-xao-xot-me/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/1_CQC9579-nam-bao-ngu-xot-me.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "14"
      },
      {
          "title": "Củ năng xào tôm thịt",
          "url": "https://monngonmoingay.com/cu-nang-xao-tom-thit/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/9200-cu-nang-xao-tom-thit.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "2"
      },
      {
          "title": "Đà điểu lúc lắc",
          "url": "https://monngonmoingay.com/da-dieu-luc-lac/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0176-da-dieu-luc-lac.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "3"
      },
      {
          "title": "Sườn non kho khế",
          "url": "https://monngonmoingay.com/suon-non-kho-khe/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/12-suon-non-kho-khe.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "35"
      },
      {
          "title": "Ức vịt chiên xốt chanh",
          "url": "https://monngonmoingay.com/uc-vit-chien-xot-chanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/11_CQC1427-uc-vit-chien-xot-chanh.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "2"
      },
      {
          "title": "Chả cá kho vân trứng",
          "url": "https://monngonmoingay.com/cha-ca-kho-van-trung/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0227-cha-ca-kho-van-trung.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "10"
      },
      {
          "title": "Mì lạnh",
          "url": "https://monngonmoingay.com/mi-lanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_8802-mi-lanh.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "6"
      },
      {
          "title": "Canh chả mực thì là",
          "url": "https://monngonmoingay.com/canh-cha-muc-thi-la/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1438-canh-cha-muc-thi-la1.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "11"
      },
      {
          "title": "Lẩu đuôi heo tiêu xanh",
          "url": "https://monngonmoingay.com/lau-duoi-heo-tieu-xanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201304250240410000003_mon-ngon-moi-ngay-lau-duoi-heo-tieu-xanh-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "14"
      },
      {
          "title": "Cánh gà xốt nước tương",
          "url": "https://monngonmoingay.com/canh-ga-xot-nuoc-tuong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/8_CQC9286-canh-ga-xot-nuoc-tuong.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "44"
      },
      {
          "title": "Nghêu chiên khoai tía tô",
          "url": "https://monngonmoingay.com/ngheu-chien-khoai-tia-to/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/7_CQC9794-ngheu-chien-khoai-tia-to.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "4"
      },
      {
          "title": "Bánh bắp tôm chiên",
          "url": "https://monngonmoingay.com/banh-bap-tom-chien/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/6_CQC9406-banh-bap-tom-chien.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "12"
      },
      {
          "title": "Heo nướng bắp cải chua",
          "url": "https://monngonmoingay.com/heo-nuong-bap-cai-chua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1058-heo-nuong-bap-cai-chua.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "90 Phút",
          "votes": "18"
      },
      {
          "title": "Mực rối",
          "url": "https://monngonmoingay.com/muc-roi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/4_CQC9610-muc-roi.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "4"
      },
      {
          "title": "Cơm trân châu",
          "url": "https://monngonmoingay.com/com-tran-chau/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0848-com-tran-chau.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "12"
      },
      {
          "title": "Mực nướng sa tế",
          "url": "https://monngonmoingay.com/muc-nuong-sa-te/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1174-muc-nuong-sa-te.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "13"
      },
      {
          "title": "Vịt quay Bắc Kinh chay",
          "url": "https://monngonmoingay.com/vit-quay-bac-kinh-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/3_CQC9342-vit-quay-bac-kinh-chay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "9"
      },
      {
          "title": "Cá lóc phi lê xốt gừng",
          "url": "https://monngonmoingay.com/ca-loc-phi-le-xot-gung/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201309121117420000002_monngonmoingay.com-ca-loc-phi-le-xot-gung-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "21"
      },
      {
          "title": "Nui đút lò hải sản",
          "url": "https://monngonmoingay.com/nui-dut-lo-hai-san/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-1543-nui-dut-lo-hai-san1.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "45 Phút",
          "votes": "5"
      },
      {
          "title": "Gỏi trái cóc",
          "url": "https://monngonmoingay.com/goi-trai-coc/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_8708-goi-trai-coc.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "6"
      },
      {
          "title": "Đậu đũa xào tôm thịt",
          "url": "https://monngonmoingay.com/dau-dua-xao-tom-thit/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/1_CQC9721-dau-dua-xao-tom-thit.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "24"
      },
      {
          "title": "Phá lấu",
          "url": "https://monngonmoingay.com/pha-lau/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0093-pha-lau.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "60 Phút",
          "votes": "15"
      },
      {
          "title": "Cá hồi xốt trái cây",
          "url": "https://monngonmoingay.com/ca-hoi-xot-trai-cay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0326-ca-hoi-xot-trai-cay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "4"
      },
      {
          "title": "Gan gà xào chua ngọt",
          "url": "https://monngonmoingay.com/gan-ga-xao-chua-ngot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/11_CQC9707_GanGaXaoChuaNgot.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "119"
      },
      {
          "title": "Cháo lươn khoai môn đậu xanh",
          "url": "https://monngonmoingay.com/chao-luon-khoai-mon-dau-xanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_9133-chao-luon-khoai-mon-dau-xanh.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "11"
      },
      {
          "title": "Ốc xào chuối xanh",
          "url": "https://monngonmoingay.com/oc-xao-chuoi-xanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0067-oc-xao-chuoi.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "10"
      },
      {
          "title": "Cá kèo kho khế",
          "url": "https://monngonmoingay.com/ca-keo-kho-khe/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/10_CQC9787_CaKeoKhoKheChua.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "8"
      },
      {
          "title": "Lưỡi heo xào lăn",
          "url": "https://monngonmoingay.com/luoi-heo-xao-lan/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0015-luoi-heo-xao-lan.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "19"
      },
      {
          "title": "Mực xào ớt khô Caramen",
          "url": "https://monngonmoingay.com/muc-xao-ot-kho-caramen/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/9_CQC9394_MucXaoOtKhoCaramel.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "13"
      },
      {
          "title": "Súp vịt quay",
          "url": "https://monngonmoingay.com/sup-vit-quay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0225-sup-vit-quay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "3"
      },
      {
          "title": "Cà ri tổ ong",
          "url": "https://monngonmoingay.com/ca-ri-to-ong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0005-ca-ri-to-ong.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "35 Phút",
          "votes": "3"
      },
      {
          "title": "Canh dền cơm nấu nghêu",
          "url": "https://monngonmoingay.com/canh-den-com-nau-ngheu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/7_CQC9701_CanhDenComNauNgheu.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "14"
      },
      {
          "title": "Salad khoai tây trộn bê thui",
          "url": "https://monngonmoingay.com/salad-khoai-tay-tron-be-thui/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0411-salad-khoai-tay-tron-be-thui.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "3"
      },
      {
          "title": "Thịt bò xào đậu cove",
          "url": "https://monngonmoingay.com/thit-bo-xao-dau-cove/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0008-thit-bo-xao-dau-cove.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "19"
      },
      {
          "title": "Gà trộn gừng chua ngọt",
          "url": "https://monngonmoingay.com/ga-tron-gung-chua-ngot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_9347-GaTrongGungChuaNgot.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "4"
      },
      {
          "title": "Tôm nướng mỡ chài",
          "url": "https://monngonmoingay.com/tom-nuong-mo-chai/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/10_CQC9528-tom-nuong-mo-chai.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "8"
      },
      {
          "title": "Cà ri chay",
          "url": "https://monngonmoingay.com/ca-ri-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0209-ca-ri-chay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "17"
      },
      {
          "title": "Nấm tuyết xào hải sâm",
          "url": "https://monngonmoingay.com/nam-tuyet-xao-hai-sam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201211220605070000004_mn-ngon-mi-ngy-nam-tuyet-xao-hai-sam-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "2"
      },
      {
          "title": "Xôi gà",
          "url": "https://monngonmoingay.com/xoi-ga/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/6_CQC9639_XoiGa.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "60 Phút",
          "votes": "11"
      },
      {
          "title": "Cần nước xào bao tử cá basa",
          "url": "https://monngonmoingay.com/can-nuoc-xao-bao-tu-ca-basa/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/1241-1024x683.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "5"
      },
      {
          "title": "Bánh ruốc chiên giòn",
          "url": "https://monngonmoingay.com/banh-ruoc-chien-gion/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0120-banh-ruoc-chien-gion.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "6"
      },
      {
          "title": "Gỏi mực chiên",
          "url": "https://monngonmoingay.com/goi-muc-chien/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/5_CQC9328_GoiMucChien.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "8"
      },
      {
          "title": "Lươn cuốn thịt om riềng",
          "url": "https://monngonmoingay.com/luon-cuon-thit-om-rieng/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/luon-cuon-thit-om-rieng-540-360.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "1"
      },
      {
          "title": "Gỏi đu đủ",
          "url": "https://monngonmoingay.com/goi-du-du/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0031-goi-du-du.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "18"
      },
      {
          "title": "Bánh mì nướng hoa hồng",
          "url": "https://monngonmoingay.com/banh-mi-nuong-hoa-hong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/8_CQC9767_BanhMiNuongHoaHong.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "5"
      },
      {
          "title": "Ngọc mực rang tổ chim",
          "url": "https://monngonmoingay.com/ngoc-muc-rang-to-chim/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_4236-ngoc-muc-rang-to-chim.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "3"
      },
      {
          "title": "Canh thanh long",
          "url": "https://monngonmoingay.com/canh-thanh-long/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/4_CQC9744_CanhThanhLong.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "15"
      },
      {
          "title": "Salad trộn kiểu Nhật",
          "url": "https://monngonmoingay.com/salad-tron-kieu-nhat/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0021-salad-tron-kieu-nhat.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "22"
      },
      {
          "title": "Cơm chiên cá mặn chay",
          "url": "https://monngonmoingay.com/com-chien-ca-man-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/3_CQC9663_ComChienCaManChay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "3"
      },
      {
          "title": "Lẩu sườn non",
          "url": "https://monngonmoingay.com/lau-suon-non/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_1643-lau-suon-non.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "7"
      },
      {
          "title": "Salad bắp trộn tôm",
          "url": "https://monngonmoingay.com/salad-bap-tron-tom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0013b-salad-bap-tron-tom.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "8"
      },
      {
          "title": "Thịt heo kho thơm",
          "url": "https://monngonmoingay.com/thit-heo-kho-thom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/thit-heo-kho-thom-37an4402.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "34"
      },
      {
          "title": "Bánh Rôti cuốn thịt bò",
          "url": "https://monngonmoingay.com/banh-roti-cuon-thit-bo/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0163-banh-roti-cuon-thit-bo.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "18"
      },
      {
          "title": "Cá đối kho thơm",
          "url": "https://monngonmoingay.com/ca-doi-kho-thom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0201-ca-doi-kho-thom.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "11"
      },
      {
          "title": "Canh măng gà viên",
          "url": "https://monngonmoingay.com/canh-mang-ga-vien/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/1_CQC8700_CanhMangGaVien.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "11"
      },
      {
          "title": "Cồi sò điệp xốt cay",
          "url": "https://monngonmoingay.com/coi-so-diep-xot-cay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201308070336570000009_mn-ngon-mi-ngy-vt-ln-xo-me-14.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "4"
      },
      {
          "title": "Vịt quay kho trứng cút",
          "url": "https://monngonmoingay.com/vit-quay-kho-trung-cut/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/AGF-0283-vit-quay-kho-trung.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "13"
      },
      {
          "title": "Gà xào chua ngọt",
          "url": "https://monngonmoingay.com/ga-xao-chua-ngot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/338-1024x683.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "31"
      },
      {
          "title": "Canh cá khoai lá giang",
          "url": "https://monngonmoingay.com/canh-ca-khoai-la-giang/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0066-canh-ca-khoai-la-giang.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "14"
      },
      {
          "title": "Burger cá kiểu Hawaii",
          "url": "https://monngonmoingay.com/burger-ca-kieu-hawaii/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0122-burger-ca-kieu-Hawaii.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "9"
      },
      {
          "title": "Cá cơm chiên giòn xốt tiêu",
          "url": "https://monngonmoingay.com/ca-com-chien-gion-xot-tieu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/ca-com-chien-gion1126.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "15"
      },
      {
          "title": "Hải sản chiên xù",
          "url": "https://monngonmoingay.com/hai-san-chien-xu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0136-hai-san-chien-xu.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "24"
      },
      {
          "title": "Bánh bông lan xốt dâu mayonnaise",
          "url": "https://monngonmoingay.com/banh-bong-lan-xot-dau-mayonnaise-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0102-banh-bong-lan-xot-dau-mayonnaise.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "15"
      },
      {
          "title": "Đậu hũ nhồi hạt sen",
          "url": "https://monngonmoingay.com/dau-hu-nhoi-hat-sen/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201210250600520000005_mn-ngon-mi-ngy-dau-hu-nhoi-hat-sen-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "18"
      },
      {
          "title": "Tôm nướng lá chuối",
          "url": "https://monngonmoingay.com/tom-nuong-la-chuoi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/TÔM-NƯỚNG-LÁ-CHUỐI_CQC1656.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "35 Phút",
          "votes": "15"
      },
      {
          "title": "Mực né",
          "url": "https://monngonmoingay.com/muc-ne/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201307251121010000000_mn-ngon-mi-ngy-ln-chin-gin-xt-tiu-xanh-110.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "19"
      },
      {
          "title": "Vịt quay xào thơm",
          "url": "https://monngonmoingay.com/vit-quay-xao-thom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/vit-quay-xao-thom-540-360.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "14"
      },
      {
          "title": "Cá trứng ngâm giấm",
          "url": "https://monngonmoingay.com/ca-trung-ngam-giam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0242_1-ca-trung-ngam-giam.png.webp",
          "people": "3 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "6"
      },
      {
          "title": "Chả khoai hấp",
          "url": "https://monngonmoingay.com/cha-khoai-hap/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/248-1024x683.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "20"
      },
      {
          "title": "Bắp non xào mực cay",
          "url": "https://monngonmoingay.com/bap-non-xao-muc-cay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/bap-non-xao-muc-cay_CQC8292.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "34"
      },
      {
          "title": "Cơm chiên chay",
          "url": "https://monngonmoingay.com/com-chien-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/AGF-1982-com-chien-chay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "14"
      },
      {
          "title": "Gỏi nghêu bông thiên lý",
          "url": "https://monngonmoingay.com/goi-ngheu-bong-thien-ly/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201210180926580000008_mon-ngon-moi-ngay-goi-nghe-bong-thien-ly-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "13"
      },
      {
          "title": "Bò áp chảo mắm ruốc",
          "url": "https://monngonmoingay.com/bo-ap-chao-mam-ruoc/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/bo-ap-chao-mam-ruoc0481.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "13"
      },
      {
          "title": "Trứng hấp tôm nấm",
          "url": "https://monngonmoingay.com/trung-hap-tom-nam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/11_CQC1460_TrungHapTomNam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "44"
      },
      {
          "title": "Viên mè chiên giòn",
          "url": "https://monngonmoingay.com/vien-me-chien-gion/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/Vien-me-chien-gion-540-360.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "5"
      },
      {
          "title": "Thịt xay kho bắp đậu",
          "url": "https://monngonmoingay.com/thit-xay-kho-bap-dau-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/thit-xay-kho-bap-dau0423.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "23"
      },
      {
          "title": "Hamburger kiểu Mehico",
          "url": "https://monngonmoingay.com/hamburger-kieu-mehico/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201307251121010000000_mn-ngon-mi-ngy-ln-chin-gin-xt-tiu-xanh-14.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "18"
      },
      {
          "title": "Miến xào lươn chay",
          "url": "https://monngonmoingay.com/mien-xao-luon-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/AGF-2002-mien-xao-luon-chay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "6"
      },
      {
          "title": "Canh sườn non táo đỏ",
          "url": "https://monngonmoingay.com/canh-suon-non-tao-do/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/canh-suon-non-tao-do-540-360.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "35 Phút",
          "votes": "28"
      },
      {
          "title": "Cá nục kho kiểu Nhật",
          "url": "https://monngonmoingay.com/ca-nuc-kho-kieu-nhat/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/ca-nuc-kho_CQC8193.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "31"
      },
      {
          "title": "Khổ qua tây xào thịt bò",
          "url": "https://monngonmoingay.com/kho-qua-tay-xao-thit-bo/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_1304-kho-qua-tay-xao-thit-bo.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "12"
      },
      {
          "title": "Hủ tiếu chay",
          "url": "https://monngonmoingay.com/hu-tieu-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/5.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "5"
      },
      {
          "title": "Nui xào gà",
          "url": "https://monngonmoingay.com/nui-xao-ga/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0181-nui-xao-ga.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "28"
      },
      {
          "title": "Lươn chiên giòn xốt tiêu xanh",
          "url": "https://monngonmoingay.com/luon-chien-gion-xot-tieu-xanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/luon-chien-gion-xot-tieu-xanh_CQC8332.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "17"
      },
      {
          "title": "Gà chiên xốt táo",
          "url": "https://monngonmoingay.com/ga-chien-xot-tao/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/9_CQC1648_GaChienXotTAo.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "9"
      },
      {
          "title": "Canh chua nấu cá hồi",
          "url": "https://monngonmoingay.com/canh-chua-nau-ca-hoi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/AGF_1954-canh-chua-dau-ca-hoi.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "21"
      },
      {
          "title": "Bánh xèo cuốn áp chảo",
          "url": "https://monngonmoingay.com/banh-xeo-cuon-ap-chao/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0100-banh-xeo-cuon-ap-chao.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "35 Phút",
          "votes": "12"
      },
      {
          "title": "Salad bắp cải xốt mè",
          "url": "https://monngonmoingay.com/salad-bap-cai-xot-me/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/salad-540.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "16"
      },
      {
          "title": "Bánh cuốn chay",
          "url": "https://monngonmoingay.com/banh-cuon-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/banh-cuon-chay_CQC8751.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "8"
      },
      {
          "title": "Canh khoai rau đắng",
          "url": "https://monngonmoingay.com/canh-khoai-rau-dang/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-9751-canh-khoai-rau-dang.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "13"
      },
      {
          "title": "Vịt xào măng",
          "url": "https://monngonmoingay.com/vit-xao-mang/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0106-vit-xao-mang.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "10"
      },
      {
          "title": "Sò huyết Tứ Xuyên",
          "url": "https://monngonmoingay.com/so-huyet-tu-xuyen/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0081-so-huyet-tu-xuyen.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "12"
      },
      {
          "title": "Gỏi bò lá chanh",
          "url": "https://monngonmoingay.com/goi-bo-la-chanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/goi-bo-la-chanh_CQC8161.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "18"
      },
      {
          "title": "Bánh mì ốp la cá mòi",
          "url": "https://monngonmoingay.com/banh-mi-op-la-ca-moi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0297-banh-mi-op-la-ca-moi.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "8"
      },
      {
          "title": "Canh bí đao nấu sườn non",
          "url": "https://monngonmoingay.com/canh-bi-dao-nau-suon-non/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/AGF-1791-canh-bi-dao-nau-suon-non.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "40"
      },
      {
          "title": "Bánh cay nhân tôm",
          "url": "https://monngonmoingay.com/banh-cay-nhan-tom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201205170440450000002_banh-cay-nhan-tom-51am599.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "14"
      },
      {
          "title": "Sushi",
          "url": "https://monngonmoingay.com/sushi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/sushi-37lm435.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "31"
      },
      {
          "title": "Cá chép nấu bung",
          "url": "https://monngonmoingay.com/ca-chep-nau-bung/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/ca-chep-nau-bung_CQC8083.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "9"
      },
      {
          "title": "Lẩu cua lá me",
          "url": "https://monngonmoingay.com/lau-cua-la-me/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201205170440360000006_lau-cua-la-me-51lv598.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "45 Phút",
          "votes": "14"
      },
      {
          "title": "Xúc xích khìa nước dừa",
          "url": "https://monngonmoingay.com/xuc-xich-khia-nuoc-dua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0061-xuc-xich-khia-nuoc-dua.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "5"
      },
      {
          "title": "Vịt xiêm giả cầy",
          "url": "https://monngonmoingay.com/vit-xiem-gia-cay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0158-vit-xiem-gia-cay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "15"
      },
      {
          "title": "Bún thịt xào sả ớt",
          "url": "https://monngonmoingay.com/bun-thit-xao-sa-ot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/AGF-1644-bun-thit-xao-sa-ot1.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "26"
      },
      {
          "title": "Burger cá ngừ",
          "url": "https://monngonmoingay.com/burger-ca-ngu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0031-burger-ca-ngu.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "8"
      },
      {
          "title": "Bún gạo xào thập cẩm",
          "url": "https://monngonmoingay.com/bun-gao-xao-thap-cam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0005-bun-gao-xao-thap-cam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "17"
      },
      {
          "title": "Nải chuối mực",
          "url": "https://monngonmoingay.com/nai-chuoi-muc/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201205170438090000006_nai-chuoi-muc-50an587.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "10"
      },
      {
          "title": "Cà bát om thịt ba chỉ",
          "url": "https://monngonmoingay.com/ca-bat-om-thit-ba-chi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0081-ca-bat-om-thit-ba-chi.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "10"
      },
      {
          "title": "Ốc giác xào bông hành",
          "url": "https://monngonmoingay.com/oc-giac-xao-bong-hanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/0340-oc-giac-xao-bong-hanh.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "5"
      },
      {
          "title": "Gỏi nấm bào ngư",
          "url": "https://monngonmoingay.com/goi-nam-bao-ngu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/8_CQC1495_GoiNamBaoNgu.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "8"
      },
      {
          "title": "Bánh mì bì Sài Gòn",
          "url": "https://monngonmoingay.com/banh-mi-bi-sai-gon/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0055-banh-mi-bi-Sai-Gon.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "15"
      },
      {
          "title": "Tôm hấp rau củ",
          "url": "https://monngonmoingay.com/tom-hap-rau-cu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0061-TomHapRauCu.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "9"
      },
      {
          "title": "Rong biển trộn nấm tuyết",
          "url": "https://monngonmoingay.com/rong-bien-tron-nam-tuyet/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0140_1-rong-bien-tron-nam-tuyet.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "9"
      },
      {
          "title": "Gà rim nước tương cà",
          "url": "https://monngonmoingay.com/ga-rim-nuoc-tuong-ca/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0217-GaRimNuocTuongCa.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "45 Phút",
          "votes": "33"
      },
      {
          "title": "Canh râu mực nấu ngót",
          "url": "https://monngonmoingay.com/canh-rau-muc-nau-ngot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201205170434200000000_canh-rau-muc-nau-ngot-49av580.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "26"
      },
      {
          "title": "Sườn chay rim mật ong",
          "url": "https://monngonmoingay.com/suon-chay-rim-mat-ong-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0324-suon-chay-rim-mat-ong.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "15"
      },
      {
          "title": "Trứng cá kho nghệ",
          "url": "https://monngonmoingay.com/trung-ca-kho-nghe/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201205170433510000008_trung-ca-kho-nghe-49an579.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "21"
      },
      {
          "title": "Cơm gạo lức chiên nghêu",
          "url": "https://monngonmoingay.com/com-gao-luc-chien-ngheu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/7_CQC1623_ComGaoLucChienNgheu.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "11"
      },
      {
          "title": "Gà nướng bưởi xốt giấm",
          "url": "https://monngonmoingay.com/ga-nuong-buoi-xot-giam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0133-ga-nuong-buoi-xot-giam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "6"
      },
      {
          "title": "Gà chiên sa tế xốt mayonnaise",
          "url": "https://monngonmoingay.com/ga-chien-sa-te-xot-mayonnaise/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0260-GaChienSate.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "36"
      },
      {
          "title": "Bắp bò kho chua ngọt",
          "url": "https://monngonmoingay.com/bap-bo-kho-chua-ngot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/6_CQC1470_BapBoKhoChuaNgot.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "112"
      },
      {
          "title": "Heo quay kho măng",
          "url": "https://monngonmoingay.com/heo-quay-kho-mang/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/201205170432230000006_heo-quay-kho-mang-49an576.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "45 Phút",
          "votes": "46"
      },
      {
          "title": "Nấm bào ngư xào sả ớt",
          "url": "https://monngonmoingay.com/nam-bao-ngu-xao-sa-ot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0114-nam-bao-ngu-xao-sa-ot.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "25"
      },
      {
          "title": "Salad đậu",
          "url": "https://monngonmoingay.com/salad-dau/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/5_CQC1538_SaldDau.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "92"
      },
      {
          "title": "Canh hến dưa cải",
          "url": "https://monngonmoingay.com/canh-hen-dua-cai/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0232-canh-hen-dua-cai.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "38"
      },
      {
          "title": "Dê nướng sa tế",
          "url": "https://monngonmoingay.com/de-nuong-sa-te/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/3.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "52"
      },
      {
          "title": "Lẩu xí quách chua cay",
          "url": "https://monngonmoingay.com/lau-xi-quach-chua-cay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/CQC8312_LauXiQuach.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "14"
      },
      {
          "title": "Canh lươn nấu bắp chuối hột",
          "url": "https://monngonmoingay.com/canh-luon-nau-bap-chuoi-hot-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0348-canh-luon-nau-bap-chuoi-hot.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "12"
      },
      {
          "title": "Cua lột xốt cam",
          "url": "https://monngonmoingay.com/cua-lot-xot-cam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0054-cua-lot-xot-cam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "10"
      },
      {
          "title": "Cá hồi nướng xốt Mayo",
          "url": "https://monngonmoingay.com/ca-hoi-nuong-xot-mayo/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/2_CQC0333_CaHoiNuongMayo.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "19"
      },
      {
          "title": "Vịt kho rau củ",
          "url": "https://monngonmoingay.com/vit-kho-rau-cu/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/2.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "23"
      },
      {
          "title": "Mực nướng tương hột",
          "url": "https://monngonmoingay.com/muc-nuong-tuong-hot/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/3_CQC0170_MucNuongTuongHot.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "25"
      },
      {
          "title": "Salad mực phổ tai",
          "url": "https://monngonmoingay.com/salad-muc-pho-tai/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/12_SaladMucPhoTai_CQC0377.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "13"
      },
      {
          "title": "Bún riêu cua xí quách",
          "url": "https://monngonmoingay.com/bun-rieu-cua-xi-quach-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0100-bun-rieu-cua-xi-quach.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "40 Phút",
          "votes": "17"
      },
      {
          "title": "Súp gà chua cay",
          "url": "https://monngonmoingay.com/sup-ga-chua-cay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0580-sup-ga-chua-cay.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "5 Phút",
          "votes": "26"
      },
      {
          "title": "Bông cải trộn tôm",
          "url": "https://monngonmoingay.com/bong-cai-tron-tom-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0159-bong-cai-tron-tom.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "13"
      },
      {
          "title": "Bún ốc",
          "url": "https://monngonmoingay.com/bun-oc/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0043-bun-oc.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "27"
      },
      {
          "title": "Gỏi đu đủ thịt bò áp chảo",
          "url": "https://monngonmoingay.com/goi-du-du-thit-bo-ap-chao/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "22"
      },
      {
          "title": "Bún giò heo nấu giấm",
          "url": "https://monngonmoingay.com/bun-gio-heo-nau-giam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG_0292-bun-gio-heo-nau-giam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "Phút",
          "votes": "22"
      },
      {
          "title": "Bê thui xào sa tế",
          "url": "https://monngonmoingay.com/be-thui-xao-sa-te-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0040-be-thui-xao-sa-te.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "10 Phút",
          "votes": "7"
      },
      {
          "title": "Gỏi nha đam",
          "url": "https://monngonmoingay.com/goi-nha-dam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0156-goi-nha-dam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "Phút",
          "votes": "12"
      },
      {
          "title": "Canh sườn hạt sen",
          "url": "https://monngonmoingay.com/canh-suon-hat-sen-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/10_CanhSuonHatSen_CQC0401.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "272"
      },
      {
          "title": "Đậu hũ nhồi xốt me",
          "url": "https://monngonmoingay.com/dau-hu-nhoi-xot-me-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0223-dau-hu-nhoi-xot-me.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "24"
      },
      {
          "title": "Khai vị đầu xuân",
          "url": "https://monngonmoingay.com/khai-vi-dau-xuan/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0252-khai-vi-dau-xuan1.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "Phút",
          "votes": "13"
      },
      {
          "title": "Bò viên chay xào thập cẩm",
          "url": "https://monngonmoingay.com/bo-vien-chay-xao-thap-cam-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0058-bo-vien-chay-xao-thap-cam.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "13"
      },
      {
          "title": "Miến xào nghêu tay cầm",
          "url": "https://monngonmoingay.com/mien-xao-ngheu-tay-cam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/08_MienXaoGheu_CQC0605.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "17"
      },
      {
          "title": "Thịt bò nướng mù tạt",
          "url": "https://monngonmoingay.com/thit-bo-nuong-mu-tat/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0572-thit-bo-nuong-mu-tat.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "Phút",
          "votes": "18"
      },
      {
          "title": "Gà cuộn xôi xoài",
          "url": "https://monngonmoingay.com/ga-cuon-xoi-xoai-2/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0146-ga-cuon-xoi-xoai.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "45 Phút",
          "votes": "7"
      },
      {
          "title": "Phở cuốn",
          "url": "https://monngonmoingay.com/pho-cuon/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0254-pho-cuon.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "Phút",
          "votes": "11"
      },
      {
          "title": "Lẩu chua thịt bò",
          "url": "https://monngonmoingay.com/lau-chua-thit-bo/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0222-lau-chua-thit-bo.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "15"
      },
      {
          "title": "Su hào xào hải sản",
          "url": "https://monngonmoingay.com/su-hao-xao-hai-san/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/08/IMG-0229-su-hao-xao-hai-san.png.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "25 Phút",
          "votes": "19"
      },
      {
          "title": "Suông tôm giò heo",
          "url": "https://monngonmoingay.com/suong-tom-gio-heo/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/suong-gio-heo-2.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "0"
      },
      {
          "title": "Cháo cá giò heo",
          "url": "https://monngonmoingay.com/chao-ca-gio-heo/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/chao-ca-gio-heo-2.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "1"
      },
      {
          "title": "Cháo bồ câu",
          "url": "https://monngonmoingay.com/chao-bo-cau/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2015/04/CACH-LAM-CHAO-BO-CAU-MNMN-Buoc-4.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "1"
      },
      {
          "title": "Thịt kho xốt tương",
          "url": "https://monngonmoingay.com/thit-kho-xot-tuong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/thit-kho-xot-tuong-2.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "6"
      },
      {
          "title": "Sườn hầm tỏi",
          "url": "https://monngonmoingay.com/suon-ham-toi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/suon-ham-toi-2.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "3"
      },
      {
          "title": "Bí xanh tiềm tứ hải",
          "url": "https://monngonmoingay.com/bi-xanh-tiem-tu-hai/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/bi-xanh-tiem-tu-hai-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "2"
      },
      {
          "title": "Đậu hũ kho nấm rơm",
          "url": "https://monngonmoingay.com/dau-hu-kho-nam-rom/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/dau-hu-kho-nam-rom-500.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "6"
      },
      {
          "title": "Canh thịt bò cải xoong",
          "url": "https://monngonmoingay.com/canh-thit-bo-cai-xoong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/canh-thit-bo-cai-xoong-500.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "5"
      },
      {
          "title": "Chả hấp chay",
          "url": "https://monngonmoingay.com/cha-hap-chay/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/cha-ca-hap-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "4"
      },
      {
          "title": "Gà tiềm hạt sen",
          "url": "https://monngonmoingay.com/ga-tiem-hat-sen/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/ga-tiem-ham-hat-sen.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "3"
      },
      {
          "title": "Sườn nấu đậu",
          "url": "https://monngonmoingay.com/suon-nau-dau/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/suon-nau-dau-2.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "8"
      },
      {
          "title": "Bò kho",
          "url": "https://monngonmoingay.com/bo-kho/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/bo-kho-2.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "10"
      },
      {
          "title": "Bồ câu quay nước dừa",
          "url": "https://monngonmoingay.com/bo-cau-quay-nuoc-dua/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/bo-cau-quay-nuoc-dua-2.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "5"
      },
      {
          "title": "Bắp cải tím xào hải sản",
          "url": "https://monngonmoingay.com/bap-cai-tim-xao-hai-san/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/bap-cai-tim-xao-hai-san1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "1"
      },
      {
          "title": "Rau càng cua trộn dầu giấm",
          "url": "https://monngonmoingay.com/rau-cang-cua-tron-dau-giam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/rau-cang-cua-tron-dau-giam-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "0"
      },
      {
          "title": "Cá thu rim nước trà xanh",
          "url": "https://monngonmoingay.com/ca-thu-rim-nuoc-tra-xanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2008/04/ca-thu-rim-nuoc-tra-xanh-1.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "0"
      },
      {
          "title": "Cá hú kho xốt tương",
          "url": "https://monngonmoingay.com/ca-hu-kho-xot-tuong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2019/04/ca-hu-kho-xot-tuong-500.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "3"
      },
      {
          "title": "Bắp bò ngâm nước mắm",
          "url": "https://monngonmoingay.com/bap-bo-ngam-nuoc-mam/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "1"
      },
      {
          "title": "Kimbap cuộn trứng thịt nguội",
          "url": "https://monngonmoingay.com/kimbap-cuon-trung-thit-nguoi/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "0"
      },
      {
          "title": "Cơm nắm cá ngừ tẩm trứng chiên",
          "url": "https://monngonmoingay.com/com-nam-ca-ngu-tam-trung-chien/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "0"
      },
      {
          "title": "Pizza bắp cải",
          "url": "https://monngonmoingay.com/pizza-bap-cai/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "0"
      },
      {
          "title": "Bánh crepe xếp tầng",
          "url": "https://monngonmoingay.com/banh-crepe-xep-tang/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "0"
      },
      {
          "title": "Bò lúc lắc vị phở",
          "url": "https://monngonmoingay.com/bo-luc-lac-vi-pho/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "20 Phút",
          "votes": "0"
      },
      {
          "title": "Cá hồi ngâm tương",
          "url": "https://monngonmoingay.com/ca-hoi-ngam-tuong/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "0"
      },
      {
          "title": "Cơm trộn cá ngừ rong biển",
          "url": "https://monngonmoingay.com/com-tron-ca-ngu-rong-bien/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "30 Phút",
          "votes": "0"
      },
      {
          "title": "Pudding trà xanh",
          "url": "https://monngonmoingay.com/pudding-tra-xanh/",
          "image": "https://monngonmoingay.com/wp-content/smush-webp/2023/01/no-image.jpg.webp",
          "people": "4 Người",
          "difficulty": "Dễ",
          "time": "15 Phút",
          "votes": "1"
      }
  ];
  
      
    // const results = this.chunkArray(recipes, 300);
    const results = await Promise.all(
      recipes.map(async ({ url }) => {
        try {
          const { data } = await this.axiosInstance.get(url);
          const $ = cheerio.load(data);

          const recipe = {
            description: $('.detail_main p').first().text().trim(),
            ingredients: $('#section-nguyenlieu ul li')
              .map((_, el) => $(el).text().trim())
              .get()
              .join(', '),
            preparation: $(
              '#section-soche p, #section-soche div, #section-soche ul li',
            )
              .map((_, el) => $(el).text().trim())
              .get()
              .join('\n'), // Lấy từ <p>, <div>, <ul><li>
            execution: $(
              '#section-thuchien p, #section-thuchien div, #section-thuchien ul li',
            )
              .map((_, el) => $(el).text().trim())
              .get()
              .join('\n'),
            usage: $('#section-howtouse p').first().text().trim(),
            tips: $('#section-tips p').first().text().trim(),
          };

          return { url, recipe };
        } catch (error) {
          return { url, error: 'Failed to crawl data' };
        }
      }),
    );

    return results;
  }
}
