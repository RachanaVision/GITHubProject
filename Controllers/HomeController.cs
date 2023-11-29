using GITHub.Models;
using GitHubProject.Models;
using Microsoft.AspNetCore.Mvc;
using Octokit;
using System.Xml.Linq;

namespace GitHubProject.Controllers
{
    public class HomeController : Controller
    {
        public GitHubService service;
        private readonly IConfiguration _configuration;
        public string owner = "RachanaVision";
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {            
            return View();
        }

        public IActionResult User()
        {
            return View();
        }

        public IActionResult Repository()
        {
            return View();
        }
        public IActionResult AddUser()
        {
            return View();  
        }

        public IActionResult Edit()
        {
            return View();  
        }

        [HttpGet]
        public async Task<List<RepoInformation>> GetAllRepository()
        {
            var github = new GitHubClient(new ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(_configuration.GetSection("GitHubToken").Value);

            List<RepoInformation> repoInformationList = new List<RepoInformation>();

            var repoList = await github.Repository.GetAllForUser(owner);

            foreach (var repo in repoList)
            {
                RepoInformation repoInformation = new RepoInformation();
                repoInformation.Id = Convert.ToInt32(repo.Id);
                repoInformation.Name = repo.Name;
                repoInformation.Description = repo.Description;
                repoInformation.HtmlUrl = repo.HtmlUrl;

                repoInformationList.Add(repoInformation);
            }
            return repoInformationList;
        }

        [HttpPost]
        public async Task<string> CreateRepository([FromBody]CreateRepository repository)
        {
            var github = new GitHubClient(new ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(_configuration.GetSection("GitHubToken").Value);

            string name = repository.RepoName;
            var repo = new NewRepository(name) {
                Description = repository.Description,
                AutoInit = true };
            await github.Repository.Create(repo);

            string response = "Repository " + name + " is created successfully..!!";
            return response;
        }

        [HttpPut]
        public async Task<string> EditRepository(string name,string description)
        {
            var github = new GitHubClient(new ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(_configuration.GetSection("GitHubToken").Value);

            var repository = await github.Repository.Get(owner, name);
            var update = new RepositoryUpdate
            {
                Description = description                                          
            };

            var updatedRepo = await github.Repository.Edit(owner, name, update);
            string response = "Description of Repository updated successfully..!!";
            return response;
        }

        [HttpGet]
        public async Task<IActionResult> GetRepositoryByName(string name)
        {
            var github = new GitHubClient(new ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(_configuration.GetSection("GitHubToken").Value);

            var repository = await github.Repository.Get(owner, name);

            var repositoryInfo = new
            {
                Name = repository.Name,
                Description = repository.Description,
            };

            return Ok(repositoryInfo);
        }


        [HttpDelete]
        public async Task<string> DeleteRepository(string name)
        {
            var github = new GitHubClient(new ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(_configuration.GetSection("GitHubToken").Value);

            await github.Repository.Delete(owner, name);

            string response = "Repository" + name + "Deleted Successfully..!!";
            return response;
        }

        [HttpGet]
        public async Task<List<UserInformation>> GetAllUsersInRepository(string name)
        {
            var github = new GitHubClient(new ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(_configuration.GetSection("GitHubToken").Value);

            List<UserInformation> userInformationList = new List<UserInformation>();
            var userList = await github.Repository.Collaborator.GetAll(owner, name);

            foreach (var user in userList)
            {
                UserInformation userInformation = new UserInformation();
                userInformation.Id = user.Id;
                userInformation.UserName = user.Login;
                userInformation.RepoName = name;

                userInformationList.Add(userInformation);
            }
            return userInformationList;
        }

        [HttpPost]
        public async Task<string> AddUserInRepository([FromBody] AddUser user)
        {
            var github = new GitHubClient(new ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(this._configuration.GetSection("GitHubToken").Value);

            string repoName = user.RepoName;
            string username = user.Username;
            await github.Repository.Collaborator.Add(owner, repoName, username);

            string response = username + " is successfully added in " + repoName;
            return response;
        }

        [HttpDelete]
        public async Task<string> DeleteUserFromRepository(string repoName, string userName)
        {
            var github = new GitHubClient(new ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(this._configuration.GetSection("GitHubToken").Value);

            await github.Repository.Collaborator.Delete(owner, repoName, userName);

            string response = userName + " is successfully removed from " + repoName;
            return response;
        }
    }
}