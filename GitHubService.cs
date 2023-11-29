using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Net;
using Octokit;
using GITHub.Models;

namespace GitHubProject
{
    public class GitHubService
    {
        private readonly IConfiguration _configuration;
        public string owner = "RachanaVision";
        public GitHubService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<RepoInformation>> GetAllRepository()
        {
            var github = new GitHubClient(new Octokit.ProductHeaderValue("GITHub"));
            github.Credentials = new Credentials(this._configuration.GetSection("GitHubToken").Value);

            List<RepoInformation> repoInformationList = new List<RepoInformation>();

            var repoList = await github.Repository.GetAllForUser(owner);

            foreach (var repo in repoList)
            {
                RepoInformation repoInformation = new RepoInformation();
                repoInformation.Name = repo.Name;
                repoInformation.Description = repo.Description;
                repoInformation.HtmlUrl = repo.HtmlUrl;

                repoInformationList.Add(repoInformation);
            }
            return repoInformationList;
        }

    }
}
