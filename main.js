const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const { builtinModules } = require('module');
dotenv.config();

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

// aws region 및 자격증명 설정
AWS.config.update({
   accessKeyId: process.env.ACCESS_KEY,
   secretAccessKey: process.env.SECRET_ACCESS_KEY,
   region: 'ap-northeast-2',
});
// 자격증명 데이터를 따로 파일로 관리한다면 다음으로 호출할수 있다.
// AWS.config.loadFromPath('./config.json');

// let numb = 0
// let state = true;

const ec2 = new AWS.EC2();

let number;

function main() {
    
        flag = false;
        console.log("                                                            ");
        console.log("                                                            ");
        console.log("------------------------------------------------------------");
        console.log("           Amazon AWS Control Panel using SDK               ");
        console.log("------------------------------------------------------------");
        console.log("  1. list instance                2. available zones        ");
        console.log("  3. start instance               4. available regions      ");
        console.log("  5. stop instance                6. create instance        ");
        console.log("  7. reboot instance              8. list images            ");
        console.log("                                 99. quit                   ");
        console.log("------------------------------------------------------------");
        
        readline.question('Enter an integer: ', num => {
            number = Number(num);
        
            if(number){
                
             switch(number) {
                case 1:
                    listInstances();
                    break;

                case 2:
                    availableZones();
                    break;
                
                case 3:
                    readline.question("Enter instance id: ", id => {
                        startInstance(id);
                    });
                    break;                

                case 4:
                    availableRegions();
                    break;

                case 5:
                    readline.question("Enter instance id: ", id => {
                        stopInstance(id);
                    });
                    break; 
                    
                case 6:
                    readline.question("Enter ami id: ", id => {
                        createInstance(id);
                    });
                    break; 

                case 7:
                    readline.question("Enter instance id: ", id => {
                        rebootInstance(id);
                    });
                    break; 

                case 8:
                    listImages();
                    break;

                case 99:
                    console.log("bye! ");
                    readline.close();
                    return;

                default:
                    console.log("concentration! ");
                    setTimeout(main,500);
                    break;
             }

            }else{
                console.log("concentration!")
                setTimeout(main,500);
            }
        });
}


//인스턴스 목록 출력
function listInstances() {
    var params = {
        DryRun: false
      };
    
    /* EC2에 있는 인스턴스 리스트 출력 */
    ec2.describeInstances(params).promise()
    .then((data) => {
        let num = Object.keys(data.Reservations).length
        if(num != 0){
            data.Reservations.forEach((data) => {
                let ins = data.Instances[0];
                console.log("[id] " + ins.InstanceId + ", [AMI] " + ins.ImageId + ", [type] " + ins.InstanceType + ", [state] " + ins.State.Name.padStart(10) + ", [monitoring state] " + ins.Monitoring.State)
            })  ;
        }else{
            console.log("") ; 
        }
    })
    .then(setTimeout(main, 1000))
    .catch(err => console.log("Error: ", err));
}

function availableZones() {
    console.log("Available zones.... ");

    let params = {};
    ec2.describeAvailabilityZones(params).promise()
    .then((data) => {
        let zone = data.AvailabilityZones;
        zone.forEach((d) => {
          console.log("[id] " + d.ZoneId + ", [region] " + d.RegionName.padStart(15) + ", [zone] " + d.ZoneId); 
        });
        console.log("You have access to " + zone.length + "Availability Zones.");
    }).then(() => {
        setTimeout(main, 1000);
    }).catch((err) => {
        console.log("Error", err);
    })
}

function startInstance(instance_id) {
    var params = {
        InstanceIds: [instance_id],
        DryRun: true
      };
      
      console.log("Starting .... " + instance_id);
        ec2.startInstances(params, function(err, data) {
          if (err && err.code === 'DryRunOperation') {
            params.DryRun = false;
            ec2.startInstances(params, function(err, data) {
                if (err) {
                  console.log("Error", err);
                } else if (data) {
                  console.log("Successfully started instance " + instance_id);
                }
            });
          } else {
            console.log("You don't have permission to start instances.");
          }
          setTimeout(main, 1000);
        });
    }

function availableRegions() {
    console.log("Available regions ....");

var params = {};

ec2.describeRegions(params).promise().then((data) => {
    let region  = data.Regions;
    region.forEach((r) => {
        console.log("[region] " + r.RegionName.padStart(15) + ", [endpoint] " + r.Endpoint);
    });
}).then(() => {
    setTimeout(main, 1000);
})
.catch((err) => {
    console.log("Error", err);
})
}

function stopInstance(instance_id){
    var params = {
        InstanceIds: [instance_id],
        DryRun: true
      };

    ec2.stopInstances(params, function(err, data) {
        if (err && err.code === 'DryRunOperation') {
          params.DryRun = false;
          ec2.stopInstances(params, function(err, data) {
              if (err) {
                console.log("Error", err);
              } else if (data) {
                console.log("Successfully stop instance " + instance_id);
              }
          });
        } else {
          console.log("You don't have permission to stop instances");
        }
        setTimeout(main, 1000);
      });
}


function createInstance(ami_id) {
    var instanceParams = {
        ImageId: ami_id, 
        InstanceType: 't2.micro',
        KeyName: 'term_project',
        MinCount: 1,
        MaxCount: 1
     };
     
     // Create a promise on an EC2 service object
     var instancePromise = ec2.runInstances(instanceParams).promise();
     
     // Handle promise's fulfilled/rejected states
     instancePromise.then(
       function(data) {
         var instanceId = data.Instances[0].InstanceId;
         console.log("Successfully started instance " + instanceId + "based on AMI " + ami_id);
    }).then(() => {setTimeout(main, 1000)})
    .catch(err => {
        console.log("Err" + err);
    });
}

function rebootInstance (instance_id) {
    console.log("Rebooting .... " + instance_id);

var params = {
    InstanceIds: [instance_id],
    DryRun: true
  };
  
  ec2.rebootInstances(params, function(err, data) {
    if (err && err.code === 'DryRunOperation') {
      params.DryRun = false;
      ec2.rebootInstances(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else if (data) {
            console.log("Successfully rebooted instance " + instance_id);
          }
      });
    } else {
      console.log("You don't have permission to reboot instances.");
    }
    setTimeout(main, 1000);
  });
}

function listImages() {
    console.log("Lising images .....");
    var params = {
        DryRun: false,
        Filters: [
            {
            Name: "name",
            Values: ["image-slave"]
            }
        ]
      };
      
      ec2.describeImages(params).promise().then((data) => {
        let ima = data.Images;
        ima.forEach((i) => {
          console.log("[ImageID] " + i.ImageId, ", [Name] " + i.Name + ", [Owner] " + i.OwnerId);
        })
      }).then(setTimeout(main, 1000))
      .catch((err) => {
        console.log("Error", err.stack);
      })
}

setTimeout(main, 1000);