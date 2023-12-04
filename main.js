const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.SECRET_ACCESS_KEY);
// aws region 및 자격증명 설정
AWS.config.update({
   accessKeyId: process.env.ACCESS_KEY,
   secretAccessKey: process.env.SECRET_ACCESS_KEY,
   region: 'ap-northeast-2',
});
// 자격증명 데이터를 따로 파일로 관리한다면 다음으로 호출할수 있다.
// AWS.config.loadFromPath('./config.json');

/* EC2에 있는 인스턴스 리스트 출력 */
const ec2 = new AWS.EC2();
ec2.describeInstanceStatus().promise()
.then((data) => {
  console.log('EC2 : ', JSON.stringify(data, null, 2));
});
