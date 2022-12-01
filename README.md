# k6demo

#K6 Integration with jenkins pipeline 
How to integrate jenkins pipeline with k6 ? 
create <testartifact>.js file as per requirement &
step1 - Ensure all the test supporting artifacts are uploaded to git with no errors.
step -2 create a jenkinsfile where you define pipeline (This K6 Peline demo currently has 2 pipeline scripts created) classified as below:-
   
    1 - jenkinsfile-1 is a integration jenkins pipeline with k6 cloud
    2 - jenkinsfile-2 is a integration jenkins pipeline with Influxdb and Grafana with  <Cloud API token>.
    
    
    The overall solution package helps us to run K6 from JEnkins pipeline with Git Repo with .JSON as test output locally. Real time metrics pushed to InfluxDB and grafana.
    Deep insight of Test run with HTML Report is available on K6 cloud whichis a trial access for 15 days.

