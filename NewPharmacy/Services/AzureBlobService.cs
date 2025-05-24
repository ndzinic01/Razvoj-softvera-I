using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

public class AzureBlobService
{
    private readonly string _accessKey;

    public AzureBlobService(IConfiguration configuration)
    {
        _accessKey = configuration["AzureBlob:AccessKey"];
    }

    public async Task<string> UploadImageAsync(IFormFile file, string containerName)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Invalid file");

        string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

        BlobServiceClient blobServiceClient = new BlobServiceClient(_accessKey);
        BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

        await containerClient.CreateIfNotExistsAsync();

        BlobClient blobClient = containerClient.GetBlobClient(fileName);

        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, overwrite: true);
        }

        return blobClient.Uri.ToString();
    }
}



